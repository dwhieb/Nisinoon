export function Research(req, res) {

  const { publication } = req.params

  res.render(`Research/${ publication }.md`, {
    Research: true,
    title:    `Fedorchak et al. 2023. Strategies for lexical expansion in Algonquian languages.`,
  })

}
