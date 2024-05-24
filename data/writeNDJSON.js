/**
 * Serializes an array to an NDJSON file.
 */

import { createWriteStream } from 'node:fs'
import { once }              from 'node:events'

export default async function writeNDJSON(data, outPath) {

  const writeStream = createWriteStream(outPath)

  for (const item of data) {
    writeStream.write(JSON.stringify(item))
    writeStream.write(`\r\n`)
  }

  writeStream.end()

  await once(writeStream, `close`)

}
