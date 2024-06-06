describe(`Search`, function() {

  it(`renders`, function() {
    cy.visit(`/search`)
    cy.title().should(`equal`, `Nisinoon | Search`)
  })

})
