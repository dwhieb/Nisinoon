import db from '../../database/index.js'

export function Components(req, res) {

  res.render(`Components/Components`, {
    Components:   true,
    construction: true,
    pageCSS:      res.app.locals.styles.Components,
    title:        `Components`,
  })

}
