/* global location */

export default class AdvancedSearch {

  render() {

    const url      = new URL(location.href)
    const query    = url.searchParams
    const advanced = query.get(`advanced`)

    if (!advanced || query.size) return

  }

}
