import browserslist                  from 'browserslist'
import { build }                     from 'esbuild'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import path                          from 'node:path'

const isProduction = process.env.NODE_ENV === `production`

const layoutInputPath  = path.resolve(import.meta.dirname, `../layouts/main/main.css`)
const layoutOutputPath = path.resolve(import.meta.dirname, `../assets/styles/main.css`)

const config = {
  bundle:      true,
  entryPoints: [layoutInputPath],
  minify:      isProduction,
  outfile:     layoutOutputPath,
  plugins:     [esbuildPluginBrowserslist(browserslist(`defaults`), { printUnknownTargets: false })],
}

export default async function buildCSS() {

  console.info(`Building CSS.`)

  await build(config)

}
