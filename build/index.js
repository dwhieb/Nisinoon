import buildCSS     from './buildCSS.js'
import buildJS      from './buildJS.js'
import buildSVG     from './buildSVG.js'
import emptyDirs    from './emptyDirs.js'
import logBuildTime from './logBuildTime.js'

console.info(`Building app.`)

await emptyDirs()
await buildCSS()
await buildJS()
await buildSVG()
await logBuildTime()

console.info(`Finished building app.`)
