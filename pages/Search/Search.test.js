describe(`Search`, function() {

  it(`renders`, function() {
    cy.visit(`/search`)
    cy.title().should(`equal`, `Nisinoon | Search`)
    cy.get(`h1`).should(`have.text`, `Search the Database`)
  })

})
