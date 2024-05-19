export function Bibliography(req, res) {
  res.render(`Bibliography/Bibliography`, {
    Bibliography: true,
    title:        `Bibliography`,
  })
}
