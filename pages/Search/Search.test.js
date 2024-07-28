describe(`Search`, function() {

  it(`no search`, function() {
    cy.visit(`/search`)
    cy.title().should(`equal`, `Nisinoon | Search`)
    // Do not show results if a search was not submitted.
    cy.get(`#results`).should(`not.exist`)
  })

  describe(`Search Mode`, function() {

    it(`toggles`, function() {
      cy.visit(`/search`)
      cy.get(`#advanced-search-form`).should(`not.be.visible`)
      cy.get(`input[value=advanced]`).check()
      cy.get(`#advanced-search-form`).should(`be.visible`)
      cy.get(`#quick-search-form`).should(`not.be.visible`)
      cy.get(`input[value=quick]`).check()
      cy.get(`#advanced-search-form`).should(`not.be.visible`)
      cy.get(`#quick-search-form`).should(`be.visible`)
    })

    it(`loads the correct tab when page loads`, function() {
      cy.visit(`/search?advanced=true`)
      cy.get(`#quick-search-form`).should(`not.be.visible`)
      cy.get(`#advanced-search-form`).should(`be.visible`)
    })

  })

  describe(`Quick Search`, function() {

    it(`no results found`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`bad search`)
      cy.get(`#quick-search-form`).submit()
      cy.contains(`.no-results`, `No results found.`)
    })

    it(`some results`, function() {
      const search = `atimw`
      cy.visit(`/search`)
      cy.get(`#search-box`).type(search)
      cy.get(`#quick-search-form`).submit()
      cy.get(`#search-box`).should(`have.value`, search)
      cy.get(`.num-results`).should(`have.text`, `Showing results 1–2 of 2.`)
    })

    it(`Option: Case Sensitive (default)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`ATIMW`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, 2)
      cy.get(`#results tbody tr`).should(`have.length`, 2)
    })

    it(`Option: Case Sensitive (checked)`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-case-sensitive-box`).check()
      cy.get(`#search-box`).type(`ATIMW`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.no-results`)
      cy.get(`#quick-case-sensitive-box`).should(`be.checked`)
    })

    it(`Option: Match Diacritics (default)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`aštimw`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, `of 9`)
    })

    it(`Option: Match Diacritics (checked)`, function() {
      cy.visit(`/search`)
      cy.get(`#diacritics-box`).check()
      cy.get(`#search-box`).type(`aštimw`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, `of 2`)
    })

    it(`Option: Regular Expressions (checked)`, function() {
      cy.visit(`/search`)
      cy.get(`#regex-box`).check()
      cy.get(`#search-box`).type(`e{{}2}`) // This is how you escape the `{` character in the `.type()` command.
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, `of 1,968`)
    })

    it(`Form (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`aamæhk`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, 2)
      cy.get(`#results tbody tr`).should(`have.length`, 2)
    })

    it(`UR (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`αhso`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Tags`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`motorize`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Forms (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`gan̈ba8i`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`URs (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`iinoo'ei`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Glosses (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`motorisé`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`language filter only`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-language-select`).select(`Cree_East`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`#results tbody tr`).should(`have.length`, 6)
    })

    it(`language filter + search query`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`yi`)
      cy.get(`#quick-language-select`).select(`Cree_East`)
      cy.get(`#quick-search-form`).submit()
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Settings`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-case-sensitive-box`).check()
      cy.get(`#diacritics-box`).check()
      cy.get(`#regex-box`).check()
      cy.get(`#quick-language-select`).select(`Cree_East`)
      cy.reload()
      cy.get(`#quick-case-sensitive-box`).should(`be.checked`)
      cy.get(`#diacritics-box`).should(`be.checked`)
      cy.get(`#regex-box`).should(`be.checked`)
      cy.get(`#quick-language-select`).should(`have.value`, `Cree_East`)
    })

  })

  describe(`Advanced Search`, function() {

    it(`no search criteria (returns all results)`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 11,`)
    })

    it(`Language`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#advanced-language-select`).select(`Cree_East`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 6`)
    })

    it(`Component: Form`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#form-box`).type(`atimw`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 2`)
    })

    it(`Component: Tags`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#tags-box`).type(`dog`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 7`)
    })

    it(`Option: Case Sensitive`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#advanced-case-sensitive-box`).check()
      cy.get(`#form-box`).type(`ATIMW`)
      cy.get(`#advanced-search-form`).submit()
      cy.get(`.no-results`)
      cy.get(`#advanced-case-sensitive-box`).should(`be.checked`)
    })

    it(`Settings`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#advanced-language-select`).select(`Cree_East`)
      cy.get(`#advanced-case-sensitive-box`).check()
      cy.reload()
      cy.get(`#advanced-language-select`).should(`have.value`, `Cree_East`)
      cy.get(`#advanced-case-sensitive-box`).should(`be.checked`)
    })

  })

  describe(`Pagination`, function() {

    it(`defaults`, function() {

      cy.visit(`/search`)
      cy.get(`#quick-search-form`).submit()

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
      cy.get(`#quick-search-form`).submit()
      cy.contains(`.pagination li`, `2`).click()
      // NB: The 101st result in the database is currently Arapaho "-oʔooʔoe-".
      cy.get(`#results td`).first().should(`have.text`, `Arapaho`)
      .next()
      .should(`have.text`, `-oʔooʔoe-`)
    })

  })

  describe(`Sorting`, function() {

    it(`single-column sort`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`dog`)
      cy.get(`#quick-search-form`).submit()
      cy.contains(`button`, `Form`).click()
      cy.get(`#results tbody tr`).first().should(`have.attr`, `id`, `Arapaho-607`)
      cy.get(`#results tbody tr`).last().should(`have.attr`, `id`, `Cree_Innu-70`)
      cy.contains(`button`, `Form`).click()
      cy.get(`#results tbody tr`).first().should(`have.attr`, `id`, `Cree_Innu-70`)
      cy.get(`#results tbody tr`).last().should(`have.attr`, `id`, `Arapaho-607`)
    })

    // Wait to test this until Advanced Search is implemented.
    // This will make it easier to select a small set of components for testing.
    it(`multi-column sort`)

  })

})
