/**
 * A class for interacting with Google Drive
 */

import { google }   from 'googleapis'
import path         from 'node:path'
import { readFile } from 'node:fs/promises'

export default class Drive {

  dataFolderID = `15fBZsPI_RyCU78H0FLf0lYuhLUR8wy2G`

  languagesSpreadsheetID = `1jQZqMrzW4f_tdyG_DTV_jT9c_iFSvwIPhmLp0EWh3Wk`

  orthographyKeyID = `1b_Iy1mkWaGbJAcNo8BWpQDWxy7c_reSUsbrtbJ4a1Pc`

  async getComponentsData(lang) {

    const query        = `'${ this.dataFolderID }' in parents`
    const spreadsheets = await this.getFilesOrFolders(query)
    const spreadsheet  = spreadsheets.find(sheet => sheet.name === lang)

    if (!spreadsheet) {
      throw new Error(`Missing spreadsheet. Possible name mismatch.`)
    }

    const { data: { values: components } } = await this.sheetsClient.spreadsheets.values.get({
      range:         `Components`,
      spreadsheetId: spreadsheet.id,
    })

    const { data: { values: tokens } } = await this.sheetsClient.spreadsheets.values.get({
      range:         `Tokens`,
      spreadsheetId: spreadsheet.id,
    })

    return { components, tokens }

  }

  async getFilesOrFolders(query) {

    const results = []

    const getNextPage = async pageToken => {

      const { data } = await this.driveClient.files.list({
        pageToken,
        q: query,
      })

      results.push(...data.files)

      if (data.nextPageToken) {
        await getNextPage(data.nextPageToken)
      }

    }

    await getNextPage()

    return results

  }

  async getLanguagesData() {

    const res = await this.sheetsClient.spreadsheets.values.get({
      range:         `Languages`,
      spreadsheetId: this.languagesSpreadsheetID,
    })

    return res.data.values

  }

  async getOrthographiesData() {

    const { data } = await this.driveClient.files.export({
      fileId:   this.orthographyKeyID,
      mimeType: `text/csv`,
    })

    return data

  }

  async initialize() {

    if (!process.env.DRIVE_CREDENTIALS) {
      const json = await readFile(path.resolve(import.meta.dirname, `credentials.json`), `utf8`)
      process.env.DRIVE_CREDENTIALS = json
    }

    const authConfig = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.DRIVE_CREDENTIALS),
      // keyFile: path.resolve(import.meta.dirname, `credentials.json`),
      scopes:      [`https://www.googleapis.com/auth/drive`],
    })

    const authClient = await authConfig.getClient()

    this.driveClient = google.drive({
      auth:    authClient,
      version: `v3`,
    })

    this.sheetsClient = google.sheets({
      auth:    authClient,
      version: `v4`,
    })

  }

}
