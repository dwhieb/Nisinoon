function letterToIndex(letter) {
  return letter.toLowerCase().charCodeAt(0) - 97
}

export default function groupColumns(record, ...colTypes) {

  const keys = Object.keys(record)
  const items = []

  for (const colType of colTypes) {

    const letteredColumns = keys.filter(key => key.startsWith(colType))

    for (const letteredColumn of letteredColumns) {

      const [, letter] = letteredColumn.split(`-`)
      const i          = letterToIndex(letter)
      const data       = record[letteredColumn]

      if (data) {
        items[i]    ??= {}
        const item    = items.at(i)
        item[colType] = data
      }

    }

  }

  return items.filter(Boolean)

}
