import db from '../../database/index.js'

export function Search(req, res) {

  res.render(`Search/Search`, {
    cssClass: `search`,
    pageCSS:  res.app.locals.styles.Search,
    Search:   true,
    title:    `Search`,
  })

}
