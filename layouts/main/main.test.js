describe(`App Shell`, function() {

  describe(`Main Nav`, function() {

    const narrowConfig = { viewportWidth: 500 }
    const wideConfig   = { viewportWidth: 1500 }

    it(`is open on wide screens`, wideConfig, function() {
      cy.visit(`/`)
      cy.get(`.menu-icon`).should(`not.be.visible`)
    })

    it.only(`adjusts based on screen size`, narrowConfig, function() {
      cy.visit(`/`)
      // The menu should be collapsed on narrow screens.
      cy.get(`.nav .links`).should(`have.class`, `visually-hidden`)
      cy.get(`.menu-icon`).should(`be.visible`).click()
      // The menu can be toggled open.
      cy.contains(`.nav .links`, `About`).should(`be.visible`)
      // The menu collapses on resize.
      cy.viewport(600, 750)
      cy.get(`.nav .links`).should(`have.class`, `visually-hidden`)
      // The menu expands and the menu button is hidden when resized to a wide viewport.
      cy.viewport(1500, 750)
      cy.get(`.menu-icon`).should(`not.be.visible`)
    })

  })

})
