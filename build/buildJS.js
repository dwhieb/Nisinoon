import browserslist                  from 'browserslist'
import { build }                     from 'esbuild'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import path                          from 'node:path'

const isProduction   = process.env.NODE_ENV === `production`
const mainScriptPath = path.resolve(import.meta.dirname, `../layouts/main/main.js`)
const scriptsDir     = path.resolve(import.meta.dirname, `../assets/scripts`)

const config = {
  bundle:      true,
  entryPoints: [mainScriptPath],
  format:      `esm`,
  minify:      isProduction,
  outfile:     path.resolve(scriptsDir, `main.js`),
  plugins:     [esbuildPluginBrowserslist(browserslist(`defaults`), { printUnknownTargets: false })],
  sourcemap:   isProduction ? true : `inline`,
}

export default async function buildJS() {
  console.info(`Building JavaScript.`)
  await build(config)
  console.info(`Finished building JavaScript.`)
}
