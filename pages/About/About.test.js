describe(`About`, function() {

  it(`renders`, function() {
    cy.visit(`/`)
    cy.title().should(`equal`, `Nisinoon | About`)
    cy.get(`h1`).should(`have.text`, `Nisinoon`)
  })

})
