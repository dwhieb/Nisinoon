import dlx2html              from '@digitallinguistics/dlx2html'
import { ExpressHandlebars } from 'express-handlebars'
import path                  from 'node:path'
import scription2dlx         from '@digitallinguistics/scription2dlx'

const dlxOptions = { errors: true }

const htmlOptions = {
  classes: [`ex`, `igl`],
  glosses: true,
  tag:     `li`,
}

function inlineExample(str) {
  return `<i class=inex>${ replaceHyphens(str) }</i>`
}

function interlinear(cssClasses, opts) {

  if (typeof cssClasses !== `string`) {
    opts = cssClasses
  }

  const scription = opts.fn(this)
  const dlx       = scription2dlx(scription, dlxOptions)
  const html      = dlx2html(dlx, htmlOptions)

  return `<ol class='examples ${ cssClasses }'>${ html }</ol>`

}

function is(a, b) {
  return a == b
}

function translation(str) {
  return `<span class=tln>‘${ str }’</span>`
}

/**
 * Replaces regular hyphens (U+2010) with non-breaking hyphens (U+2011).
 * @param {String} data
 * @returns String
 */
function replaceHyphens(data) {
  return data.replaceAll(`-`, `\u{2011}`)
}

function section(name, opts) {
  this.sections ??= {}
  this.sections[name] = opts.fn(this)
  return null
}

const hbs = new ExpressHandlebars({
  defaultLayout: `main/main.hbs`,
  extname:       `hbs`,
  helpers:       {
    igl:  interlinear,
    inex: inlineExample,
    is,
    section,
    tln:  translation,
  },
  layoutsDir:  path.resolve(import.meta.dirname, `../layouts`),
  partialsDir: [
    path.resolve(import.meta.dirname, `../layouts/main`),
    path.resolve(import.meta.dirname, `../components`),
    path.resolve(import.meta.dirname, `../pages`),
  ],
})

export default hbs
