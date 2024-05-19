describe(`Error Page`, function() {

  it(`404`, function() {
    cy.request({
      failOnStatusCode: false,
      url:              `/not-found`,
    })
    .its(`status`).should(`equal`, 404)
  })

  it(`500`, function() {
    cy.request({
      failOnStatusCode: false,
      url:              `/500-test`,
    })
    .its(`status`).should(`equal`, 500)
  })

})
