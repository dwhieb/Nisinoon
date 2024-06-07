export function Search(req, res) {

  const context = {
    construction: true,
    pageCSS:      res.app.locals.styles.Search,
    Search:       true,
    title:        `Search`,
  }

  if (`q` in req.query) {

    const { q }  = req.query
    const { db } = req.app

    if (q === ``) context.components = db.components
    else context.components = req.app.db.search(q.trim())

  }

  res.render(`Search/Search`, context)

}
