export function Component(req, res) {

  const component = {
    form: `-a·mɛhk-`,
    id:   1234,
  }

  const language = `Menominee`

  res.render(`Component/Component`, {
    component,
    Component:    true,
    construction: true,
    json:         JSON.stringify(component, null, 2),
    language,
    pageCSS:      res.app.locals.styles.Component,
    title:        `${ language }: ${ component.form }`,
  })

}
