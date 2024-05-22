import browserslist                  from 'browserslist'
import { build }                     from 'esbuild'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import path                          from 'node:path'
import { readdir as recurse }        from 'node:fs/promises'

const isProduction  = process.env.NODE_ENV === `production`
const layoutsDir    = path.resolve(import.meta.dirname, `../layouts`)
const pagesDir      = path.resolve(import.meta.dirname, `../pages`)
const stylesDir     = path.resolve(import.meta.dirname, `../assets/styles`)

const baseConfig = {
  bundle:   true,
  external: [`*.woff2`],
  minify:   isProduction,
  plugins:  [
    esbuildPluginBrowserslist(browserslist(`defaults`), { printUnknownTargets: false }),
  ],
}

async function buildCSSFile(cssPath) {

  const { name } = path.parse(cssPath)
  const outfile  = path.join(stylesDir, `${ name }.css`)

  await build(Object.assign({}, baseConfig, {
    entryPoints: [cssPath],
    nodePaths:   [
      `classes`,
      `components`,
    ],
    outfile,
  }))

}

export default async function buildCSS() {

  console.info(`Building CSS.`)

  // Build CSS for layouts
  await buildCSSFile(path.join(layoutsDir, `main/main.css`))
  await buildCSSFile(path.join(layoutsDir, `prose/prose.css`))

  // Build CSS for individual pages
  const files = await recurse(pagesDir, { recursive: true })

  for (const file of files) {
    if (!file.endsWith(`.css`)) continue
    await buildCSSFile(path.join(pagesDir, file))
  }

  console.info(`Finished building CSS.`)

}
