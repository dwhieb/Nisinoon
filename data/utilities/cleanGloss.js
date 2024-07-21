export default function cleanGloss(gl) {
  if (gl === `NG`) return ``
  return gl.normalize()
}
