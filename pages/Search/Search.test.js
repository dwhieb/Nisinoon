describe(`Search`, function() {

  it(`no search`, function() {
    cy.visit(`/search`)
    cy.title().should(`equal`, `Nisinoon | Search`)
    // Do not show results if a search was not submitted.
    cy.get(`#results`).should(`not.exist`)
  })

  describe(`Quick Search`, function() {

    it(`no results found`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`bad search`)
      cy.get(`form`).submit()
      cy.contains(`.no-results`, `No results found.`)
    })

    it(`some results + repopulates search box + reset search`, function() {
      const search = `atimw`
      cy.visit(`/search`)
      cy.get(`#search-box`).type(search)
      cy.get(`form`).submit()
      cy.get(`#search-box`).should(`have.value`, search)
      cy.get(`.num-results`).should(`have.text`, `Showing results 1–2 of 2.`)
      cy.get(`#results tbody tr`).should(`have.length`, 2)
      cy.get(`#reset-button`).click()
      cy.get(`#search-box`).should(`have.value`, ``)
      cy.get(`#language-select`).should(`have.value`, `all`)
      cy.location(`search`).should(`eq`, ``)
    })

    it(`case insensitive (default)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`ATIMW`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 2)
      cy.get(`#results tbody tr`).should(`have.length`, 2)
    })

    // Might not implement this
    it.skip(`case sensitive`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`ATIMW`)
      cy.get(`form`).submit()
    })

    it(`diacritic-insensitive (default)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`aštimw`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, `of 9`)
    })

    it(`diacritic-sensitive`, function() {
      cy.visit(`/search`)
      cy.get(`#diacritics-box`).check()
      cy.get(`#search-box`).type(`aštimw`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, `of 2`)
    })

    it(`Form (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`aamæhk`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 2)
      cy.get(`#results tbody tr`).should(`have.length`, 2)
    })

    it(`UR (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`αhso`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Proto-Algonquian (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`(aa)ntep`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Definition (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`motorize`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Forms (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`gan̈ba8i`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`URs (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`iinoo'ei`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Proto-Algonquian (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`-eʔs-`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Definitions (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`motorisé`)
      cy.get(`form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

  })

  describe(`Language Filter`, function() {

    it(`language filter only`, function() {
      cy.visit(`/search`)
      cy.get(`#language-select`).select(`Cree_East`)
      cy.get(`form`).submit()
      cy.get(`#results tbody tr`).should(`have.length`, 6)
    })

    it(`language filter + search query`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`yi`)
      cy.get(`#language-select`).select(`Cree_East`)
      cy.get(`form`).submit()
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

  })

  describe(`Pagination`, function() {

    it(`defaults`, function() {

      cy.visit(`/search`)
      cy.get(`form`).submit()

      // Return 100 results by default
      cy.get(`#results tbody tr`).should(`have.length`, 100)

      // Return first page of results by default
      cy.get(`#results td`).first().should(`have.text`, `Abenaki`)
      .next()
      .should(`have.text`, `ɔ̃ben-`)

      // Showing X of Y results.
      cy.get(`.num-results`).invoke(`text`).should(`match`, /^Showing results 1–100 of .+?\.$/v)

    })

    // NB: Currently testing using querystring.
    // TODO: Once the "# of Results to Show" dropdown is implemented, test using that instead.
    it(`limit`, function() {
      cy.visit(`/search?limit=10&q=`)
      cy.get(`#results tbody tr`).should(`have.length`, `10`)
    })

    // NB: Currently testing using querystring.
    // TODO: Once the "# of Results to Show" dropdown is implemented, test using that instead.
    // WARNING: Long-running test. Only run as needed.
    it.skip(`limit: Infinity`, function() {
      cy.visit(`/search?limit=Infinity&q=`)
      cy.get(`#results tbody tr`).should(`have.length.of.at.least`, 12000)
    })

    it(`offset`, function() {
      cy.visit(`/search`)
      cy.get(`form`).submit()
      cy.contains(`.pagination li`, `2`).click()
      // NB: The 101st result in the database is currently Arapaho "-nooθ-".
      cy.get(`#results td`).first().should(`have.text`, `Arapaho`)
      .next()
      .should(`have.text`, `-nooθ-`)
    })

  })

  describe(`Settings`, function() {

    it(`saves the user's selections across visits`, function() {
      cy.visit(`/search`)
      cy.get(`#diacritics-box`).check()
      cy.get(`#language-select`).select(`Cree_East`)
      cy.reload()
      cy.get(`#diacritics-box`).should(`be.checked`)
      cy.get(`#language-select`).should(`have.value`, `Cree_East`)
    })

  })

  describe(`Sorting`, function() {

    it(`single-column sort`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`dog`)
      cy.get(`form`).submit()
      cy.contains(`button`, `Form`).click()
      cy.get(`#results tbody tr`).first().should(`have.attr`, `id`, `Arapaho-607`)
      cy.get(`#results tbody tr`).last().should(`have.attr`, `id`, `Cree_Innu-70`)
      cy.contains(`button`, `Form`).click()
      cy.get(`#results tbody tr`).first().should(`have.attr`, `id`, `Cree_Innu-70`)
      cy.get(`#results tbody tr`).last().should(`have.attr`, `id`, `Meskwaki-383`)
    })

    // Wait to test this until Advanced Search is implemented.
    // This will make it easier to select a small set of components for testing.
    it(`multi-column sort`)

  })

})
