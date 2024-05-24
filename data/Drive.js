/**
 * A class for interacting with Google Drive
 */

import { google } from 'googleapis'
import path       from 'node:path'

const mimeType = `text/csv`

export default class Drive {

  dataFolderID = `15fBZsPI_RyCU78H0FLf0lYuhLUR8wy2G`

  languagesSpreadsheetID = `1jQZqMrzW4f_tdyG_DTV_jT9c_iFSvwIPhmLp0EWh3Wk`

  async getFilesOrFolders(query) {

    const results = []

    const getNextPage = async pageToken => {

      const { data } = await this.client.files.list({
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
    const { data } = await this.getSpreadsheetByID(this.languagesSpreadsheetID)
    return data
  }

  getSpreadsheetByID(fileId) {
    return this.client.files.export({ fileId, mimeType })
  }

  async getSpreadsheetByName(name) {

    const query        = `'${ this.dataFolderID }' in parents`
    const spreadsheets = await this.getFilesOrFolders(query)
    const spreadsheet  = spreadsheets.find(sheet => sheet.name === name)

    if (!spreadsheet) {
      throw new Error(`Missing spreadsheet. Possible name mismatch.`)
    }

    const { data } = await this.client.files.export({ fileId: spreadsheet.id, mimeType })

    return data

  }

  async initialize() {

    const authConfig = new google.auth.GoogleAuth({
      keyFile: path.resolve(import.meta.dirname, `credentials.json`),
      scopes:  [`https://www.googleapis.com/auth/drive`],
    })

    const authClient = await authConfig.getClient()

    this.client = google.drive({
      auth:    authClient,
      version: `v3`,
    })

  }

}
