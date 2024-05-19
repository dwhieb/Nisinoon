import buildCSS from './buildCSS.js'
import buildJS  from './buildJS.js'
import buildSVG from './buildSVG.js'

console.info(`Building app.`)

await buildCSS()
await buildJS()
await buildSVG()

console.info(`Finished building app.`)
