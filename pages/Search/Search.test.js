describe(`Search`, function() {

  it(`no search`, function() {
    cy.visit(`/search`)
    cy.title().should(`equal`, `Nisinoon | Search`)
    // Do not show results if a search was not submitted.
    cy.get(`.results`).should(`not.exist`)
  })

  it(`no results found`, function() {
    cy.visit(`/search`)
    cy.get(`#search-box`).type(`bad search`)
    cy.get(`form`).submit()
    cy.contains(`.no-results`, `No results found.`)
  })

  it(`all results`, function() {
    cy.visit(`/search`)
    cy.get(`form`).submit()
    cy.get(`.results tbody tr`).should(`have.length`, 10)
  })

  it(`some results`, function() {
    cy.visit(`/search`)
    cy.get(`#search-box`).type(`aan`)
    cy.get(`form`).submit()
    cy.get(`.results tbody tr`).should(`have.length`, 2)
  })

  describe(`Quick Search`, function() {

    it(`Form (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`aamæhk`)
      cy.get(`form`).submit()
      cy.get(`.results tbody tr`).should(`have.length`, 2)
    })

    it(`Forms (Source)`)

    it.only(`Definition (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`think`)
      cy.get(`form`).submit()
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`Definitions (Source)`)

  })

})
