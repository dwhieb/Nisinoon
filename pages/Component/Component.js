import db from '../../database/index.js'

export function Component(req, res) {

  const { componentID } = req.params
  const component       = db.index.get(componentID)

  if (!component) {

    const status = 404

    res.status = status

    return res.render(`Error/Error.md`, {
      cssClass: `error`,
      Error:    true,
      message:  `A component with ID <code>${ componentID }</code> does not exist.`,
      status,
      title:    `Component Not Found`,
    })

  }

  res.render(`Component/Component`, {
    component,
    Component:    true,
    construction: true,
    json:         JSON.stringify(component, null, 2),
    pageCSS:      res.app.locals.styles.Component,
    title:        `${ component.language }: ${ component.form }`,
  })

}
