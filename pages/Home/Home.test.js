describe(`home`, function() {

  it(`renders`, function() {
    cy.visit(`/`)
    cy.title().should(`equal`, `Nisinoon | Home`)
    cy.get(`h1`).should(`have.text`, `Nisinoon`)
  })

})
