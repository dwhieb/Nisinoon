import Components            from '../models/Components.js'
import Drive                 from '../Drive.js'
import Languages             from '../models/Languages.js'
import { outputFile }        from 'fs-extra/esm'
import { parse as parseCSV } from 'csv-parse/sync'
import path                  from 'node:path'
import ProgressBar           from 'progress'
import { readFile }          from 'node:fs/promises'
import retryRequest          from '../utilities/retryRequest.js'

const csvPath = path.resolve(import.meta.dirname, `tags.csv`)

const drive = new Drive

await drive.initialize()

async function fetchTagsData() {

  const fileId   = `1Hkw5y9wqUcLboX4NRR_akI1vrztMi8EMdFvya6y5cgM`  // Retrieved from URL of spreadsheet.
  const mimeType = `text/csv`

  const { data } = await drive.driveClient.files.export({ fileId, mimeType })

  await outputFile(csvPath, data)

  return data

}

async function loadTags() {

  const csv = await readFile(csvPath, `utf8`)

  const records = parseCSV(csv, {
    columns: [
      `rawTags`,
      `definition`,
      `type`,
      `subcategory`,
    ],
    from:             2,
    relaxColumnCount: true,
    skipEmptyLines:   true,
    trim:             true,
  })

  const map = new Map

  for (const {
    definition, rawTags, subcategory, type,
  } of records) {

    if (!rawTags) continue

    const tags = rawTags
    .split(`\n`)
    .map(tag => tag.trim())
    .filter(Boolean)
    .sort()

    if (tags.length) {
      map.set(definition, {
        definition,
        subcategory,
        tags,
        type,
      })
    }

  }

  return map

}

async function updateSpreadsheet(lang) {

  const dataFolderID = `15fBZsPI_RyCU78H0FLf0lYuhLUR8wy2G`
  const query        = `'${ dataFolderID }' in parents`
  const spreadsheets = await drive.getFilesOrFolders(query)
  const spreadsheet  = spreadsheets.find(sheet => sheet.name === lang)

  const { data } = await drive.sheetsClient.spreadsheets.values.get({
    range:         `Components`,
    spreadsheetId: spreadsheet.id,

  })

  const originalRows    = data.values
  const numOriginalRows = originalRows.length
  const headings        = originalRows.shift()
  const { range }       = data

  // Replace "Definition" heading with "Tags"
  const definitionIndex = headings.indexOf(`Project Definition`)
  const tagsHeader      = `Tags`

  if (definitionIndex !== -1) headings.splice(definitionIndex, 1, tagsHeader)

  const records = originalRows.map(row => {

    const record = {}

    row.forEach((cell, i) => {
      const heading = headings[i]
      if (heading) record[heading] = cell
    })

    return record

  })

  const cols        = Components.columns
  const tagsMap     = await loadTags()
  const updatedRows = [headings]

  for (const record of records) {

    const gloss       = record[cols.gloss]?.trim()
    const subcategory = record[cols.subcategory]
    const type        = record[cols.type]
    const tagsInfo    = tagsMap.get(gloss)

    if (gloss && tagsInfo && tagsInfo.type == type && tagsInfo.subcategory == subcategory) {
      record[cols.tags] = tagsInfo.tags.join(`, `)
    }

    const row = Object.values(record)

    updatedRows.push(row)

  }

  const numUpdatedRows = updatedRows.length

  if (numOriginalRows !== numUpdatedRows) {
    console.warn(`The number of updated records does not match the original number of records.`)
    console.table({
      numOriginalRows,
      numUpdatedRows,
    })
    return
  }

  const valueInputOption = `RAW`

  await drive.sheetsClient.spreadsheets.values.update({
    range,
    requestBody: {
      values: updatedRows,
    },
    spreadsheetId: spreadsheet.id,
    valueInputOption,
  })

}

async function updateAllSpreadsheets() {

  const languages = new Languages

  await languages.load()

  const progressBar = new ProgressBar(`:bar`, { total: languages.size })

  for (const key of languages.keys()) {
    await retryRequest(updateSpreadsheet, key)
    progressBar.tick()
  }

}

export {
  fetchTagsData,
  updateAllSpreadsheets,
  updateSpreadsheet,
}
