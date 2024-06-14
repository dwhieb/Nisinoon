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

  const components = req.app.db.search(q)
  .slice(offset, offset + limit)

  Object.assign(context, {
    components,
    numResults: components.length.toLocaleString(),
    results:    true,
  })

  res.render(`Search/Search`, context)

}
