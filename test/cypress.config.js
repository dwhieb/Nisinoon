import { defineConfig } from "cypress"

export default defineConfig({
  downloadsFolder: `test/downloads`,
  e2e:             {
    baseUrl:     `http://localhost:3002`,
    specPattern: [`index.test.js`, `**/*.test.js`],
    supportFile: false,
  },
  fixturesFolder:         `test/fixtures`,
  screenshotOnRunFailure: false,
  screenshotsFolder:      `test/screenshots`,
  videosFolder:           `test/videos`,
})
