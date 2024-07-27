/**
 *
 * @param {URL}    url A URL object.
 * @param {String} param The URL parameter to update.
 * @param {any}    val The value to update the parameter with.
 */
export default function changeParam(url, param, val) {
  url = new URL(url.href)
  url.searchParams.set(param, val)
  return url.toString()
}
