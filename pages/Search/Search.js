export function Search(req, res) {

  const { db } = req.app

  const context = {
    construction:  true,
    numComponents: db.index.size.toLocaleString(),
    numLanguages:  db.languages.size.toLocaleString(),
    pageCSS:       res.app.locals.styles.Search,
    Search:        true,
    title:         `Search`,
    url:           req.originalUrl,
  }

  if (`q` in req.query) {

    const { q } = req.query

    if (q === ``) context.components = db.components
    else context.components = req.app.db.search(q.trim())

    context.results    = true
    context.numResults = context.components.length.toLocaleString()

  }

  res.render(`Search/Search`, context)

}
