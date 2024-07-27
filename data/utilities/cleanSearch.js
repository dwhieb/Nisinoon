/**
 * Trims and NFC normalizes a search input, since the data in the database is also normalized, thus enabling matches.
 * @param {String} str The search input to clean.
 * @returns {String}
 */
export default function cleanSearch(str) {
  return str.trim().normalize()
}
