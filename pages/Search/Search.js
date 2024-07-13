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

  // NB: offset = # of records to SKIP

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

  // Pagination

  const lastPageOffset = Math.floor(allResults.length / limit) * limit
  const nextPageOffset = Math.min(offset + limit, allResults.length)
  const prevPageOffset = Math.max(offset - limit, 0)

  const prevPages = []
  const nextPages = []

  let prevOffset = offset - limit

  while (prevOffset >= 0 && prevPages.length < 5) {

    prevPages.unshift({
      link:    changeParam(url, `offset`, prevOffset),
      pageNum: Math.floor(prevOffset / limit) + 1,
    })

    prevOffset -= limit

  }

  const [first] = prevPages

  if (first && first.pageNum !== 1) {
    first.jump = true
  }

  let nextOffset = offset + limit

  while (nextOffset <= allResults.length && nextPages.length <= 5) {

    nextPages.push({
      link:    changeParam(url, `offset`, nextOffset),
      offset:  nextOffset,
      pageNum: Math.floor(nextOffset / limit) + 1,
    })

    nextOffset += limit

  }

  const last = nextPages.at(-1)

  if (last && last.offset !== lastPageOffset) {
    last.jump = true
  }

  // Render page

  Object.assign(context, {
    hasResults: true,
    numResults: results.length.toLocaleString(),
    pagination: {
      currentPage: Math.floor(offset / limit) + 1,
      endIndex:    Math.min(offset + limit, allResults.length).toLocaleString(),
      links:       {
        firstPage: changeParam(url, `offset`, 0),
        lastPage:  changeParam(url, `offset`, lastPageOffset),
        nextPage:  changeParam(url, `offset`, nextPageOffset),
        prevPage:  changeParam(url, `offset`, prevPageOffset),
      },
      nextPages,
      prevPages,
      show:       allResults.length > limit,
      startIndex: (offset + 1).toLocaleString(),
    },
    results,
    totalResults: allResults.length.toLocaleString(),
  })

  res.render(`Search/Search`, context)

}
