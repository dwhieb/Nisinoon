import boldItalic            from 'markdown-it-ib'
import createMarkdownParser  from 'markdown-it'
import { default as hbs }    from './handlebars.js'
import markdownAttributes    from 'markdown-it-attrs'

const layoutPath = `../layouts/markdown/markdown.hbs`

const config = {
  html:        true,
  quotes:      `“”‘’`,
  typographer: true,
}

const parser = createMarkdownParser(config)
.use(boldItalic)
.use(markdownAttributes)

export default function markdownEngine(app) {
  return async function render(filePath, context, cb) {

    const md      = await hbs.render(filePath, context)
    const content = parser.render(md)

    app.render(
      layoutPath,
      Object.assign({ content }, context),
      (err, html) => cb(err, html),
    )

  }
}


