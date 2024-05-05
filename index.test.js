describe(`Nisinoon`, function() {

  it(`404`, function() {
    cy.request({
      failOnStatusCode: false,
      url:              `/not-found`,
    })
    .its(`status`)
    .should(`equal`, 404)
  })

  it(`500`)

})
