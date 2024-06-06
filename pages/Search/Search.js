export function Search(req, res) {

  res.render(`Search/Search`, {
    construction: true,
    pageCSS:      res.app.locals.styles.Search,
    Search:       true,
    title:        `Search`,
  })

}
