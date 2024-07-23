import Components            from '../models/Components.js'
import Drive                 from '../Drive.js'
import Languages             from '../models/Languages.js'
import { outputFile }        from 'fs-extra/esm'
import { parse as parseCSV } from 'csv-parse/sync'
import path                  from 'node:path'
import ProgressBar           from 'progress'
import { readFile }          from 'node:fs/promises'
import { setTimeout }        from 'node:timers/promises'

const csvPath = path.resolve(import.meta.dirname, `tags.csv`)

const drive = new Drive

await drive.initialize()

async function fetchTagsData() {

  const fileId   = `10CSHneFoAMCK7UOj4irC_9FHvr1HeQ_tpi96eJz9MIg`  // Retrieved from URL of spreadsheet.
  const mimeType = `text/csv`

  const { data } = await drive.driveClient.files.export({ fileId, mimeType })

  await outputFile(csvPath, data)

}

async function loadTags() {

  const csv = await readFile(csvPath, `utf8`)

  const records = parseCSV(csv, {
    columns: [
      `rawTags`,
      `definition`,
    ],
    from:             2,
    relaxColumnCount: true,
    skipEmptyLines:   true,
    trim:             true,
  })

  const map = new Map

  for (const { definition, rawTags } of records) {
    const tags = rawTags.split(`\n`).map(tag => tag.trim())
    map.set(definition, tags)
  }

  return map

}

async function updateSpreadsheet(lang) {

  const dataFolderID = `15fBZsPI_RyCU78H0FLf0lYuhLUR8wy2G`
  const query        = `'${ dataFolderID }' in parents`
  const spreadsheets = await drive.getFilesOrFolders(query)
  const spreadsheet  = spreadsheets.find(sheet => sheet.name === lang)

  const { data: { range } } = await drive.sheetsClient.spreadsheets.values.get({
    range:         `Components`,
    spreadsheetId: spreadsheet.id,
  })

  const { data: originalCSV } = await drive.driveClient.files.export({
    fileId:   spreadsheet.id,
    mimeType: `text/csv`,
  })

  const records = parseCSV(originalCSV, Components.csvOptions)

  const cols        = Components.columns
  const headings    = Object.keys(records[0])
  const tagsMap     = await loadTags()
  const updatedRows = [headings]

  for (const record of records) {

    const gloss = record[cols.gloss].trim()
    if (!gloss) continue

    const type = record[cols.type]
    if (type !== `initial`) continue

    const tags = tagsMap.get(gloss)
    if (!tags) continue

    record[cols.definition] = tags.join(`, `)

    updatedRows.push(Object.values(record))

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

    let waitTime = 1

    const makeRequest = async () => {
      try {

        await updateSpreadsheet(key)

      } catch (e) {

        if (e?.response?.status === 429) {

          waitTime *= 2
          console.warn(`\nHit rate limit. Retrying after ${ waitTime }ms.`)
          await setTimeout(waitTime)
          await makeRequest()

        } else {
          throw e
        }

      }
    }

    await makeRequest() // Kick off request sequence
    progressBar.tick()

  }

}

export default {
  fetchTagsData,
  updateAllSpreadsheets,
  updateSpreadsheet,
}
