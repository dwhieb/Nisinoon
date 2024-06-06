describe(`Component`, function() {

  it(`renders`, function() {

    cy.visit(`/components/Menominee-1`)
    cy.title().should(`equal`, `Nisinoon | Menominee: -aamæhkw-`)
    cy.get(`h1`).should(`have.text`, `Menominee: -aamæhkw-`)

    // Displays JSON data
    cy.get(`pre`)
    .should(`include.text`, `-aamæhkw-`)
    .invoke(`text`)
    .should(`match`, /^\{/u)
    .should(`match`, /\}$/u)

  })

  it(`404`, function() {

    cy.request({
      failOnStatusCode: false,
      url:              `/components/bad-id`,
    })
    .its(`status`).should(`equal`, 404)

  })

})
