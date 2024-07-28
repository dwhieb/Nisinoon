import escapeRegExp from 'escape-string-regexp'

/**
 *
 * @param {String}  query                         The search string.
 * @param {Object}  [options={}]                  An options object.
 * @param {Boolean} [options.caseSensitive=false] Whether the search regex should be case sensitive.
 * @param {Boolean} [options.regex=false]         Whether the search string is a regular expression.
 * @returns
 */
export default function createSearchRegExp(query, { caseSensitive, regex } = {}) {

  const pattern = regex ? query : escapeRegExp(query)
  const flags   = caseSensitive ? `v` : `iv`
  const regexp  = new RegExp(pattern, flags)

  return function testSearchRegExp(str) {
    return regexp.test(str)
  }

}
