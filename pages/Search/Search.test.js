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

  // Loads all results in the database.
  it.skip(`all results`, function() {
    cy.visit(`/search`)
    cy.get(`form`).submit()
    cy.get(`.results tbody tr`).should(`have.length`, 10)
  })

  it(`some results`, function() {
    cy.visit(`/search`)
    cy.get(`#search-box`).type(`atimw`)
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

    it(`UR (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`αhso`)
      cy.get(`form`).submit()
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`Definition (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`motorize`)
      cy.get(`form`).submit()
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`Forms (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`gan̈ba8i`)
      cy.get(`form`).submit()
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`URs (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`iinoo'ei`)
      cy.get(`form`).submit()
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`Definitions (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`motorisé`)
      cy.get(`form`).submit()
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

  })

})
