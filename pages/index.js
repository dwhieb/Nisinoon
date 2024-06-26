import { kebabCase, pascalCase } from 'change-case'

export * from './Component/Component.js'
export * from './Error/Error.js'
export * from './Research/Research.js'
export * from './Search/Search.js'

export function page(title) {
  return function handler(req, res) {

    const PascalTitle = pascalCase(title)

    res.render(`${ PascalTitle }/${ PascalTitle }`, {
      cssClass:      kebabCase(title),
      pageCSS:       res.app.locals.styles[PascalTitle],
      [PascalTitle]: true,
      title,
    })

  }
}

export function md(title) {
  return function handler(req, res) {

    const PascalTitle = pascalCase(title)

    res.render(`${ PascalTitle }/${ PascalTitle }.md`, {
      cssClass:      kebabCase(title),
      pageCSS:       res.app.locals.styles[PascalTitle],
      [PascalTitle]: true,
      title,
    })

  }
}
