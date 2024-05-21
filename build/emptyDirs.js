import { emptyDir } from 'fs-extra'
import path         from 'node:path'

export default async function emptyDirs() {
  await emptyDir(path.resolve(import.meta.dirname, `../assets/scripts`))
  await emptyDir(path.resolve(import.meta.dirname, `../assets/styles`))
}
