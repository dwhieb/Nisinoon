# Nisinoon

Website for the Algonquian Components Project (Nisinoon)

## Release Workflow

1. Increment version number.
2. Create a GitHub release to trigger deployment to Azure.

## Page Variables

| Variable     | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| `{PageName}` | The page name. Used by Handlebars to check for the current page. |
| `cssClass`   | The value to use in `<main class={name}-page>`.                  |
| `title`      | The page title. Will be displayed in the browser tab.            |
