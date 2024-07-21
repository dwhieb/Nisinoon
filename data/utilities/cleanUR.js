export default function cleanUR(UR) {
  return UR
  .normalize()
  .replace(/^\//v, ``)
  .replace(/\/$/v, ``)
}
