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

  // Long-running test. Loads all results in the database.
  it.skip(`all results`, function() {
    cy.visit(`/search`)
    cy.get(`form`).submit()
    cy.get(`.results tbody tr`).should(`have.length`, 10)
  })

  it(`some results + repopulates search box`, function() {
    const search = `atimw`
    cy.visit(`/search`)
    cy.get(`#search-box`).type(search)
    cy.get(`form`).submit()
    cy.get(`#search-box`).should(`have.value`, search)
    cy.get(`.num-results`).should(`include.text`, 2)
    cy.get(`.results tbody tr`).should(`have.length`, 2)
  })

  describe(`Quick Search`, function() {

    it(`case insensitive`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`ATIMW`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 2)
      cy.get(`.results tbody tr`).should(`have.length`, 2)
    })

    it(`Form (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`aamæhk`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 2)
      cy.get(`.results tbody tr`).should(`have.length`, 2)
    })

    it(`UR (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`αhso`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`Proto-Algonquian (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`(aa)ntep`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`Definition (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`motorize`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`Forms (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`gan̈ba8i`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`URs (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`iinoo'ei`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`Proto-Algonquian (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`-eʔs-`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

    it(`Definitions (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`motorisé`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`.results tbody tr`).should(`have.length`, 1)
    })

  })

})
