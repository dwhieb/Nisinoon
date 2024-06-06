describe(`Components`, function() {

  it(`renders`, function() {
    cy.visit(`/components`)
    cy.title().should(`equal`, `Nisinoon | Components`)
    cy.get(`h1`).should(`have.text`, `Search the Database`)
  })

})
