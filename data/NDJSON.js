import { once } from 'node:events'
import readline from 'node:readline'

import { createReadStream, createWriteStream } from 'node:fs'

export default class NDJSON {

  static async read(filePath) {

    const fileStream = createReadStream(filePath)
    const lineStream = readline.createInterface({
      crlfDelay: Infinity,
      input:     fileStream,
    })

    const data = []

    // NB: It's faster to use the `line` event than a for-await loop.
    lineStream.on(`line`, line => data.push(JSON.parse(line)))

    await once(lineStream, `close`)

    return data

  }

  static async write(data, outPath) {

    const writeStream = createWriteStream(outPath)

    for (const item of data) {
      writeStream.write(JSON.stringify(item))
      writeStream.write(`\r\n`)
    }

    writeStream.end()

    await once(writeStream, `close`)

  }

}
