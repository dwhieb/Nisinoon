export default function removeDiacritics(str) {
  return str.normalize(`NFD`).replaceAll(/\p{Diacritic}/gv, ``)
}
