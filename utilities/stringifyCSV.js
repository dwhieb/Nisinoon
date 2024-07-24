import { stringify } from 'csv-stringify/sync'

export default function stringifyCSV(rows) {

  // Don't mutate the original array, just in case.
  rows = Array.from(rows)

  const headings = rows.shift()

  return stringify(rows, {
    columns: headings,
    header:  true,
  })

}
