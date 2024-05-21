import createMarkdownParser from 'markdown-it'
import { readFile }         from 'node:fs/promises'

const layoutPath = `../layouts/markdown/markdown.hbs`
const parser     = createMarkdownParser()

export default function markdownEngine(app) {
  return async function render(filePath, context, cb) {

    const md      = await readFile(filePath, `utf8`)
    const content = parser.render(md)

    app.render(
      layoutPath,
      Object.assign({ content }, context),
      (err, html) => cb(err, html),
    )

  }
}


