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
      cy.get(`#quick-search-button`).click()
      cy.contains(`#results-info`, `No results found.`)
    })

    it(`some results`, function() {
      const search = `atimw`
      cy.visit(`/search`)
      cy.get(`#search-box`).type(search)
      cy.get(`#quick-search-button`).click()
      cy.get(`#search-box`).should(`have.value`, search)
      cy.get(`.num-results`).should(`have.text`, `Showing results 1–2 of 2.`)
    })

    it(`Option: Case Sensitive (default)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`ATIMW`)
      cy.get(`#quick-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, 2)
      cy.get(`#results tbody tr`).should(`have.length`, 2)
    })

    it(`Option: Case Sensitive (checked)`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-case-sensitive-box`).check()
      cy.get(`#search-box`).type(`ATIMW`)
      cy.get(`#quick-search-button`).click()
      cy.get(`#results-info`).should(`include.text`, `No results found.`)
      cy.get(`#quick-case-sensitive-box`).should(`be.checked`)
    })

    it(`Option: Match Diacritics (default)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`aštimw`)
      cy.get(`#quick-search-button`).click()
      cy.get(`#results tbody tr`).its(`length`).should(`be.within`, 5, 15)
    })

    it(`Option: Match Diacritics (checked)`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-diacritics-box`).check()
      cy.get(`#search-box`).type(`aštimw`)
      cy.get(`#quick-search-button`).click()
      cy.get(`#results tbody tr`).its(`length`).should(`be.within`, 1, 5)
    })

    it(`Option: Regular Expressions (checked)`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-regex-box`).check()
      cy.get(`#search-box`).type(`e{{}2}`) // This is how you escape the `{` character in the `.type()` command.
      cy.get(`#quick-search-button`).click()
      cy.get(`#results tbody tr`).should(`have.length`, 100)
    })

    it(`Form (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`aamæhk`)
      cy.get(`#quick-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, 2)
      cy.get(`#results tbody tr`).should(`have.length`, 2)
    })

    it(`UR (Project)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`αhso`)
      cy.get(`#quick-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Tags`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`horse`)
      cy.get(`#quick-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).its(`length`).should(`be.within`, 10, 50)
    })

    it(`Forms (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`gan̈ba8i`)
      cy.get(`#quick-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`URs (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`iinoo'ei`)
      cy.get(`#quick-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it.only(`Glosses (Source)`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`motorisé`)
      cy.get(`#quick-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, 1)
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`language filter only`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-language-select`).select(`Cree_East`)
      cy.get(`#quick-search-button`).click()
      cy.get(`#results tbody tr`).should(`have.length`, 6)
    })

    it(`language filter + search query`, function() {
      cy.visit(`/search`)
      cy.get(`#search-box`).type(`yi`)
      cy.get(`#quick-language-select`).select(`Cree_East`)
      cy.get(`#quick-search-button`).click()
      cy.get(`#results tbody tr`).should(`have.length`, 1)
    })

    it(`Settings`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-case-sensitive-box`).check()
      cy.get(`#quick-diacritics-box`).check()
      cy.get(`#quick-regex-box`).check()
      cy.get(`#quick-language-select`).select(`Cree_East`)
      cy.reload()
      cy.get(`#quick-case-sensitive-box`).should(`be.checked`)
      cy.get(`#quick-diacritics-box`).should(`be.checked`)
      cy.get(`#quick-regex-box`).should(`be.checked`)
      cy.get(`#quick-language-select`).should(`have.value`, `Cree_East`)
    })

  })

  describe(`Advanced Search`, function() {

    it(`No Search Criteria (returns all results)`, function() {
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

    it(`Component: Final: Primary`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#primary-box`).check()
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 4,154`)
    })

    it(`Component: Final: Secondary`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#secondary-box`).check()
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 630`)
    })

    it(`Component: Form`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#form-box`).type(`atimw`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 2`)
    })

    it(`Component: Specificity`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#specificity-select`).select(`CONCR`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 425.`)
    })

    it(`Component: Subcategory`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#subcategory-select`).select(`ADV`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 2.`)
    })

    it(`Component: Tags`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#tags-box`).type(`dog`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 10.`)
    })

    it(`Component: Type`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#type-select`).select(`medial`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 1,936`)
    })

    it(`Component: UR`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#UR-box`).type(`éθew`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 2.`)
    })

    it(`Sources: Bibliographic Source`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#bib-select`).select(`SA_MOJ2017`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 14.`)
    })

    it(`Sources: Forms`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#source-form-box`).type(`ôben`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 1.`)
    })

    it(`Sources: Glosses`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#gloss-box`).type(`by heat`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 62.`)
    })

    it(`Sources: UR`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#source-UR-box`).type(`e3ee`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 2.`)
    })

    it(`Option: Case Sensitive`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#advanced-case-sensitive-box`).check()
      cy.get(`#form-box`).type(`ATIMW`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`#results-info`).should(`include.text`, `No results found.`)
      cy.get(`#advanced-case-sensitive-box`).should(`be.checked`)
    })

    it(`Option: Match Diacritics`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#advanced-diacritics-box`).check()
      cy.get(`#form-box`).type(`aštimw`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 2`)
    })

    it(`Option: Regular Expressions (checked)`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#advanced-regex-box`).check()
      cy.get(`#form-box`).type(`e{{}2}`) // This is how you escape the `{` character in the `.type()` command.
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 1,423`)
    })

    it(`Option: All (default)`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#form-box`).type(`atimw`)
      cy.get(`#tags-box`).type(`horse`)
      cy.get(`#logic-select`).select(`all`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 1.`)
    })

    it(`Option: Any`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#form-box`).type(`atimw`)
      cy.get(`#tags-box`).type(`horse`)
      cy.get(`#logic-select`).select(`any`)
      cy.get(`#advanced-search-button`).click()
      cy.get(`.num-results`).should(`include.text`, `of 9.`)
    })

    it(`Settings`, function() {
      cy.visit(`/search`)
      cy.contains(`label`, `Advanced Search`).click()
      cy.get(`#advanced-language-select`).select(`Cree_East`)
      cy.get(`#advanced-case-sensitive-box`).check()
      cy.get(`#advanced-diacritics-box`).check()
      cy.get(`#advanced-regex-box`).check()
      cy.get(`#logic-select`).select(`any`)
      cy.reload()
      cy.get(`#advanced-language-select`).should(`have.value`, `Cree_East`)
      cy.get(`#advanced-case-sensitive-box`).should(`be.checked`)
      cy.get(`#advanced-diacritics-box`).should(`be.checked`)
      cy.get(`#advanced-regex-box`).should(`be.checked`)
      cy.get(`#logic-select`).should(`have.value`, `any`)
    })

  })

  describe(`Pagination`, function() {

    it(`defaults`, function() {

      cy.visit(`/search`)
      cy.get(`#quick-search-button`).click()

      // Return 100 results by default
      cy.get(`#results tbody tr`).should(`have.length`, 100)

      // Return first page of results by default
      cy.get(`#results td`).first().should(`have.text`, `Abenaki`)
      .next()
      .should(`have.text`, `ɔ̃ben-`)

      // Showing X of Y results.
      cy.get(`.num-results`).invoke(`text`).should(`match`, /^Showing results 1–100 of .+?\.$/v)

    })

    it(`limit`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-search-button`).click()
      cy.get(`#results tbody tr`).should(`have.length`, 100) // limit = 100 (default)
      cy.get(`#limit-select`).select(`250`)
      cy.get(`#results tbody tr`).should(`have.length`, 250) // limit = 250
      cy.get(`#search-box`).type(`man`)
      cy.get(`#limit-select`).select(`all`)
      cy.get(`#results tbody tr`).should(`have.length`, 447) // limit = all
    })

    it(`offset`, function() {
      cy.visit(`/search`)
      cy.get(`#quick-search-button`).click()
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
      cy.get(`#quick-search-button`).click()
      cy.contains(`button`, `Form`).click()
      cy.get(`#results tbody tr`).first().should(`have.attr`, `id`, `Arapaho-607`)
      cy.get(`#results tbody tr`).last().should(`have.attr`, `id`, `Cree_Innu-70`)
      cy.contains(`button`, `Form`).click()
      cy.get(`#results tbody tr`).first().should(`have.attr`, `id`, `Cree_Innu-70`)
      cy.get(`#results tbody tr`).last().should(`have.attr`, `id`, `Arapaho-607`)
    })

  })

})
