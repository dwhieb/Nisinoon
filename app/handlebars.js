import { ExpressHandlebars } from 'express-handlebars'
import path                  from 'node:path'

function section(name, opts) {
  this.sections ??= {}
  this.sections[name] = opts.fn(this)
  return null
}

const hbs = new ExpressHandlebars({
  defaultLayout: `main/main.hbs`,
  extname:       `hbs`,
  helpers:       { section },
  layoutsDir:    path.resolve(import.meta.dirname, `../layouts`),
  partialsDir:   path.resolve(import.meta.dirname, `../layouts/main`),
})

export default hbs
