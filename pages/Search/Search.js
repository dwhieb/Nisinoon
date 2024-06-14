/**
 *
 * @param {URL}    url A URL object.
 * @param {String} param The URL parameter to update.
 * @param {any}    val The value to update the parameter with.
 */
function changeParam(url, param, val) {
  url = new URL(url.href)
  url.searchParams.set(param, val)
  return url.toString()
}

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

  const allResults = req.app.db.search(q)
  const results    = allResults.slice(offset, offset + limit)
  const url        = new URL(req.originalUrl, `${ req.protocol }://${ req.host }`)

  const lastPageOffset = Math.floor(allResults.length / limit) * limit

  Object.assign(context, {
    endIndex:   Math.min(offset + limit, allResults.length).toLocaleString(),
    hasResults: true,
    links:      {
      firstPage: changeParam(url, `offset`, 0),
      lastPage:  changeParam(url, `offset`, lastPageOffset),
    },
    numResults:   results.length.toLocaleString(),
    results,
    startIndex:   offset.toLocaleString(),
    totalResults: allResults.length.toLocaleString(),
  })

  res.render(`Search/Search`, context)

}
