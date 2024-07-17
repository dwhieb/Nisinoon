export default class SortDirectives extends Map {

  constructor(directives = ``) {

    super()

    if (!directives) return

    directives.split(`,`)
    .filter(Boolean)
    .forEach((directive, i) => {

      const field     = directive.replace(/^-/v, ``)
      const direction = directive.startsWith(`-`) ? `descending` : `ascending`

      this.set(field, { direction, priority: i + 1 })

    })

  }

  /**
   * Add a new sort directive to the list of directives. NOTE: The directive will be set as first in the insertion order.
   * @param {String}                   field The field to set a new sort direction for.
   * @param {"ascending"|"descending"} direction The sort direction to use for the field.
   */
  add(field, direction) {

    this.delete(field)

    const entries = Array.from(this.entries())

    if (direction) {
      entries.unshift([field, { direction, priority: 1 }])
    }

    this.clear()

    entries.forEach(([field, { direction }], i) => {
      this.set(field, { direction, priority: i + 1 })
    })

  }

  serialize() {
    return Array.from(this.entries())
    .map(([field, { direction }]) => `${ direction === `descending` ? `-` : `` }${ field }`)
    .join(`,`)
  }

}
