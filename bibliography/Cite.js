import Cite         from 'citation-js'
import path         from 'node:path'
import { readFile } from 'node:fs/promises'

const cslPath       = path.resolve(import.meta.dirname, `./linguistics.csl`)
const styleTemplate = await readFile(cslPath, `utf8`)
const styleName     = `ling`
const config        = Cite.plugins.config.get(`@csl`)

config.templates.add(styleName, styleTemplate)

export default Cite
