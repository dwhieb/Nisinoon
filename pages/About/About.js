export function About(req, res) {
  res.render(`About/About`, {
    About: true,
    title: `About`,
  })
}
