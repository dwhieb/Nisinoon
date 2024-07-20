export function Component(req, res) {

  const { componentID } = req.params
  const component       = req.app.db.index.get(componentID)

  if (!component) {

    const status = 404

    return res
    .status(status)
    .render(`Error/Error.md`, {
      cssClass: `error`,
      Error:    true,
      message:  `A component with ID <code>${ componentID }</code> does not exist.`,
      status,
      title:    `Component Not Found`,
    })

  }

  res.render(`Component/Component`, {
    component,
    Component: true,
    json:      JSON.stringify(component, null, 2),
    pageCSS:   res.app.locals.styles.Component,
    title:     `${ component.displayLanguage }: ${ component.displayForm }`,
    url:       req.originalUrl,
  })

}
