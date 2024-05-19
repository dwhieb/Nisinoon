describe(`Research`, function() {

  it(`renders`, function() {
    cy.visit(`/research`)
    cy.title().should(`equal`, `Nisinoon | Research`)
    cy.get(`h1`).should(`have.text`, `Research`)
  })

})
