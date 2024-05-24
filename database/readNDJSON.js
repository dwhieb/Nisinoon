/**
 * Loads all the entries in an NDJSON file into memory.
 */

import { createReadStream } from 'node:fs'
import { once }             from 'node:events'
import readline             from 'node:readline'

export default async function readNDJSON(filePath) {

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
