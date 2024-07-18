import SortDirectives from '../../scripts/SortDirectives.js'

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
    languages:     db.languages.toJSON().sort((a, b) => a.name.localeCompare(b.name)),
    numComponents: db.index.size.toLocaleString(),
    numLanguages:  db.languages.size.toLocaleString(),
    pageCSS:       res.app.locals.styles.Search,
    Search:        true,
    title:         `Search`,
    url:           req.originalUrl,
  }

  if (!(`q` in req.query || `language` in req.query)) {
    return res.render(`Search/Search`, context)
  }

  // NB: offset = # of records to SKIP

  let {
    limit = 100,
    offset = 0,
    sort = ``,
  } = req.query

  const {
    diacritics,
    language,
    q,
  } = req.query

  // Search

  let   results         = req.app.db.search(q.trim(), { diacritics, language })
  const numTotalResults = results.length

  // Sort

  sort = new SortDirectives(sort)

  if (sort.size) {
    results.sort((a, b) => {

      const comparisons = Array.from(sort.entries())
      .map(([field, { direction }]) => {
        const comparison = (a[field] || ``).localeCompare(b[field] || ``)
        return direction === `ascending` ? comparison : comparison * -1
      })

      return comparisons.reduce((state, comparison) => (state ? state : comparison), 0)

    })
  }

  // Pagination

  limit   = Number(limit)
  offset  = Number(offset)
  results = results.slice(offset, offset + limit)

  const numAdjacentPages = 5
  const lastPageOffset   = Math.floor(numTotalResults / limit) * limit
  const nextPageOffset   = Math.min(offset + limit, numTotalResults)
  const prevPageOffset   = Math.max(offset - limit, 0)
  const url              = new URL(req.originalUrl, `${ req.protocol }://${ req.host }`)

  const prevPages = []
  const nextPages = []

  let prevOffset = offset - limit

  while (prevOffset >= 0 && prevPages.length < numAdjacentPages) {

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

  while (nextOffset <= numTotalResults && nextPages.length <= numAdjacentPages) {

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
      endIndex:    Math.min(offset + limit, numTotalResults).toLocaleString(),
      links:       {
        firstPage: changeParam(url, `offset`, 0),
        lastPage:  changeParam(url, `offset`, lastPageOffset),
        nextPage:  changeParam(url, `offset`, nextPageOffset),
        prevPage:  changeParam(url, `offset`, prevPageOffset),
      },
      nextPages,
      prevPages,
      show:       numTotalResults > limit,
      startIndex: (offset + 1).toLocaleString(),
    },
    results,
    sort:         Object.fromEntries(sort),
    totalResults: numTotalResults.toLocaleString(),
  })

  res.render(`Search/Search`, context)

}
