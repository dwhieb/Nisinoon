import browserslist                  from 'browserslist'
import { build }                     from 'esbuild'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import path                          from 'node:path'
import { readdir }                   from 'node:fs/promises'

const isProduction   = process.env.NODE_ENV === `production`
const mainScriptPath = path.resolve(import.meta.dirname, `../layouts/main/main.js`)
const pagesDir       = path.resolve(import.meta.dirname, `../pages`)
const scriptsDir     = path.resolve(import.meta.dirname, `../assets/scripts`)

const baseConfig = {
  bundle:    true,
  format:    `esm`,
  minify:    isProduction,
  plugins:   [esbuildPluginBrowserslist(browserslist(`defaults`), { printUnknownTargets: false })],
  sourcemap: isProduction ? true : `inline`,
}

function buildMainJS() {

  const config = Object.assign({}, baseConfig, {
    entryPoints: [mainScriptPath],
    outfile:     path.join(scriptsDir, `main.js`),
  })

  return build(config)

}

async function buildPageJS() {

  const files   = await readdir(pagesDir, { recursive: true })
  const scripts = files.filter(file => file.endsWith(`client.js`))

  for (const script of scripts) {

    const name = path.dirname(script)

    const config = Object.assign({}, baseConfig, {
      entryPoints: [path.join(pagesDir, script)],
      outfile:     path.join(scriptsDir, `${ name }.js`),
    })

    await build(config)

  }


}

export default async function buildJS() {
  console.info(`Building JavaScript.`)
  await buildMainJS()
  await buildPageJS()
  console.info(`Finished building JavaScript.`)
}
