export default class Allomorph {
  constructor(form, condition) {
    this.form = form
    if (condition) this.condition = condition.normalize()
  }
}
