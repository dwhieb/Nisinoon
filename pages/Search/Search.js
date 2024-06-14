export function Search(req, res) {

  const { db } = req.app

  const context = {
    numComponents: db.index.size.toLocaleString(),
    numLanguages:  db.languages.size.toLocaleString(),
    pageCSS:       res.app.locals.styles.Search,
    Search:        true,
    title:         `Search`,
    url:           req.originalUrl,
  }

  if (!(`q` in req.query)) {
    return res.render(`Search/Search`, context)
  }

  let {
    limit = 100,
    offset = 0,
    q,
  } = req.query

  limit  = Number(limit)
  offset = Number(offset)
  q      = q.trim().toLowerCase()

  let   components   = req.app.db.search(q)
  const totalResults = components.length.toLocaleString()

  components = components.slice(offset, offset + limit)

  const resultsShown = components.length.toLocaleString()

  Object.assign(context, {
    components,
    hasResults: true,
    resultsShown,
    totalResults,
  })

  res.render(`Search/Search`, context)

}
