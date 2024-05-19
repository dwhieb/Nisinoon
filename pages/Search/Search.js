export function Search(req, res) {
  res.render(`Search/Search`, {
    Search: true,
    title:  `Search`,
  })
}
