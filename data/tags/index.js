import Components            from '../models/Components.js'
import Drive                 from '../Drive.js'
import Languages             from '../models/Languages.js'
import { outputFile }        from 'fs-extra/esm'
import { parse as parseCSV } from 'csv-parse/sync'
import path                  from 'node:path'
import ProgressBar           from 'progress'
import { readFile }          from 'node:fs/promises'
import retryRequest          from '../utilities/retryRequest.js'

const commaRegExp       = /,\s*/v
const grammaticalRegExp = /^([A-Z+\-\(\)]|\s)+$/v
const csvPath           = path.resolve(import.meta.dirname, `tags.csv`)

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
      `gloss`,
      `rawType`,
      `rawSubcategories`,
    ],
    from:             2,
    relaxColumnCount: true,
    skipEmptyLines:   true,
    trim:             true,
  })

  const map = new Map

  for (const record of records) {

    const {
      gloss,
      rawTags,
      rawSubcategories,
      rawType,
    } = record

    if (!rawTags) continue

    const tags = rawTags
    .split(`\n`)
    .map(tag => tag.trim())
    .filter(Boolean)
    .map(tag => ({
      grammatical: grammaticalRegExp.test(tag),
      tag,
    }))
    .sort((a, b) => {

      if (a.grammatical === b.grammatical) {
        return a.tag.localeCompare(b.tag)
      }

      return a.grammatical ? -1 : 1

    })

    const subcategories = rawSubcategories
    .split(commaRegExp)
    .map(cat => cat.trim())
    .filter(Boolean)
    .map(cat => cat.toLowerCase())

    if (tags.length) {
      map.set(gloss, {
        gloss,
        subcategories,
        tags,
        type: rawType.toLowerCase(),
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

  // Replace "Project Definition" heading with "Tags"
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
    const subcategory = record[cols.subcategory]?.toLowerCase()
    const type        = record[cols.type]?.toLowerCase()
    const tagsInfo    = tagsMap.get(gloss)

    if (
      tagsInfo // Do this check here rather than an early return to ensure you don't accidentally lose rows
      && tagsInfo.type == type
      && tagsInfo.subcategories.includes(subcategory)
    ) {
      record[cols.tags] = tagsInfo.tags.map(({ tag }) => tag).join(`, `)
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
