import Citer          from './Cite.js'
import { outputFile } from 'fs-extra'
import path           from 'node:path'
import { readFile }   from 'node:fs/promises'

const bibtexPath = path.resolve(import.meta.dirname, `./bibliography.bib`)
const countPath  = path.resolve(import.meta.dirname, `../pages/Bibliography/totalEntries.hbs`)
const htmlPath   = path.resolve(import.meta.dirname, `../pages/Bibliography/entries.hbs`)

function adjustHTML(id, raw) {
  return raw
  .trim()
  .replace(/<div.+?>(.+)<\/div>/u, `<li id='${ id }'>$1</li>`)                                        // replace <div> with <li>
  .replace(/<i>(.+)<\/i>/u, `<cite class=cite>$1</cite>`)                                             // replace <i> with <cite>
  .replace(/\(doi:(?<doi>.+?)\)(?<end> |$)/u, `DOI: <a href=https://doi.org/$<doi>>$<doi></a>.$<end>`) // replace DOI with link
  .replace(/\((?<link>http.+?)\)/u, `(<a href=$<link>>view file</a>)`)                                // replace full link with text link
}

export default async function createBibliographyPage() {

  const bibtex = await readFile(bibtexPath, `utf8`)

  const citer = new Citer(bibtex, {
    forceType:     `@biblatex/text`,
    generateGraph: false,
  })

  citer.sort()

  const htmlEntries = citer.format(`bibliography`, {
    asEntryArray: true,
    format:       `html`,
    template:     `ling`,
  })
  .map(([id, raw]) => adjustHTML(id, raw))
  .join(`\n`)

  const html       = `<ul class=references-list>\n${ htmlEntries }\n</ul>`
  const numEntries = citer.data.length.toLocaleString()

  await outputFile(htmlPath, html, `utf8`)
  await outputFile(countPath, numEntries, `utf8`)

}
