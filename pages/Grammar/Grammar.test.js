describe(`Grammar`, function() {

  it(`renders`, function() {
    cy.visit(`/grammar`)
    cy.title().should(`equal`, `Nisinoon | Grammar`)
    cy.get(`h1`).should(`have.text`, `Algonquian Word-Structure Basics`)
  })

})
