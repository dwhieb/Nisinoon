const commaRegExp = /, \s*/gv

export default function parsePages(pagesString) {
  return pagesString
  .split(commaRegExp)
  .map(Number)
  .filter(Number.isInteger)
  .join(`, `)
}
