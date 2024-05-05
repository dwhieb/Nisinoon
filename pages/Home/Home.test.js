describe(`home`, function() {

  it(`renders`, function() {
    cy.visit(`/`)
    cy.get(`body`).should(`have.text`, `Nisinoon`)
  })

})
