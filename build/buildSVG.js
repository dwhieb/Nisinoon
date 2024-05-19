import createSpriteCollection from 'svgstore'
import path                   from 'node:path'

import { readdir, readFile, writeFile } from 'node:fs/promises'

const spriteOptions = {
  copyAttrs: [
    `fill`,
    `stroke`,
    `stroke-width`,
    `stroke-linecap`,
    `stroke-linejoin`,
  ],
  svgAttrs: {
    'aria-hidden': true,
    style:         `display: none;`,
  },
}

export default async function buildSVG() {

  console.info(`Building SVG sprites.`)

  const svgPath   = path.resolve(import.meta.dirname, `../assets/svg`)
  const sprites   = createSpriteCollection(spriteOptions)
  const filenames = await readdir(svgPath)

  for await (const filename of filenames) {

    const filePath = path.resolve(svgPath, filename)
    const iconName = path.basename(filename, `.svg`)
    const svg      = await readFile(filePath, `utf8`)

    sprites.add(iconName, svg)

  }

  const html        = sprites.toString({ inline: true })
  const spritesPath = path.resolve(import.meta.dirname, `../layouts/main/components/sprites/sprites.hbs`)

  await writeFile(spritesPath, html, `utf8`)

  console.info(`Finished building SVG sprites.`)

}
