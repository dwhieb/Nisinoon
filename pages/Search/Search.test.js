describe(`Search`, function() {

  it(`no search`, function() {
    cy.visit(`/search`)
    cy.title().should(`equal`, `Nisinoon | Search`)
    // Do not show results if a search was not submitted.
    cy.get(`.results`).should(`not.exist`)
  })

  describe(`Quick Search`, function() {

    it(`no results found`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`bad search`)
      cy.get(`form`).submit()
      cy.contains(`.no-results`, `No results found.`)
    })

    it(`some results + repopulates search box`, function() {
      const search = `atimw`
      cy.visit(`/search`)
      cy.get(`#search-box`).type(search)
      cy.get(`form`).submit()
      cy.get(`#search-box`).should(`have.value`, search)
      cy.get(`.num-results`).should(`have.text`, `Showing 2 of 2 results.`)
      cy.get(`.results tbody tr`).should(`have.length`, 2)
    })

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

  describe(`Pagination`, function() {

    it(`defaults`, function() {

      cy.visit(`/search`)
      cy.get(`form`).submit()

      // Return 100 results by default
      cy.get(`.results tbody tr`).should(`have.length`, 100)

      // Return first page of results by default
      cy.get(`.results td`).first().should(`have.text`, 1)

      // Showing X of Y results.
      cy.get(`.num-results`).invoke(`text`).should(`match`, /^Showing 100 of .+? results\.$/v)

    })

    // NB: Currently testing using querystring.
    // TODO: Once the "# of Results to Show" dropdown is implemented, test using that instead.
    it(`limit`, function() {
      cy.visit(`/search?limit=10&q=`)
      cy.get(`.results tbody tr`).should(`have.length`, `10`)
    })

    // NB: Currently testing using querystring.
    // TODO: Once the "# of Results to Show" dropdown is implemented, test using that instead.
    // WARNING: Long-running test. Only run as needed.
    it.skip(`limit: Infinity`, function() {
      cy.visit(`/search?limit=Infinity&q=`)
      cy.get(`.results tbody tr`).should(`have.length.of.at.least`, 12000)
    })

    // NB: Currently testing using querystring
    // TODO: Once the page links are implemented, test using that instead.
    it(`offset`, function() {
      cy.visit(`/search?offset=10&q=`)
      // NB: The 11th result in the database is currently Eastern Abenaki Component #5.
      cy.get(`.results td`).first().should(`have.text`, 5)
      .next()
      .should(`have.text`, `Eastern Abenaki`)
    })

  })

})
