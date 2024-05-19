describe(`Bibliography`, function() {

  it(`renders`, function() {
    cy.visit(`/bibliography`)
    cy.title().should(`equal`, `Nisinoon | Bibliography`)
    cy.get(`h1`).should(`have.text`, `Algonquian Components Bibliography`)
  })

})
