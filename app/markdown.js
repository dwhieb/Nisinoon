import boldItalic            from 'markdown-it-ib'
import bracketedSpans        from 'markdown-it-bracketed-spans'
import createMarkdownParser  from 'markdown-it'
import { default as hbs }    from './handlebars.js'
import markdownAttributes    from 'markdown-it-attrs'
import tableCaptions         from 'markdown-it-table-captions'

const layoutPath = `../layouts/prose/prose.hbs`

const config = {
  html:        true,
  quotes:      `“”‘’`,
  typographer: true,
}

const parser = createMarkdownParser(config)
.use(boldItalic)
.use(bracketedSpans)
.use(markdownAttributes)
.use(tableCaptions)

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


