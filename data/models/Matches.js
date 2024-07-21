export default class Matches {
  constructor({
    AI, II, TA, TI,
  }) {
    if (AI) this.AI = AI.normalize()
    if (II) this.II = II.normalize()
    if (TA) this.TA = TA.normalize()
    if (TI) this.TI = TI.normalize()
  }
}
