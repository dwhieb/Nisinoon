import { ExpressHandlebars } from 'express-handlebars'
import path                  from 'node:path'

const hbs = new ExpressHandlebars({
  extname:    `hbs`,
  layoutsDir: path.resolve(import.meta.dirname, `../layouts`),
})

export default hbs
