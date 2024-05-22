export function Research(req, res) {

  const { pub } = req.params

  res.render(`Research/${ pub }.md`, {
    Research: true,
    title:    `Fedorchak et al. 2023. Strategies for lexical expansion in Algonquian languages.`,
  })

}
