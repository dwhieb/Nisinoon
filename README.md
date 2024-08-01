# Nisinoon

Website for the Algonquian Components Project (Nisinoon)

View the project at [Nisinoon.net](https://nisinoon.net).

## How to Update the Data on the Website

The following process will fetch the latest bibliography data from Zotero and the latest component data from Google Sheets, update the site with that data, and deploy the new site to production.

1. Go to [this link](https://github.com/dwhieb/Nisinoon/actions/workflows/update.yml).
2. Click the **Run Workflow** button on the right.
3. In the popup that appears, keep the default settings and click the green **Run workflow** button.
4. Then go to [this page](https://github.com/dwhieb/Nisinoon/actions) to watch that the site deployed successfully. You can click into the current run of the "update" process (and then click into "update" once more) for a detailed breakdown of each step in the process as it happens.
5. Once the process is done running, you should be able to immediately see the latest changes to the data reflected on the website.

## How to Update Text on the Website

The following pages can be easily edited on GitHub:

- About
- Bibliography
- Grammar (Algonquian Word-Structure Basics)
- Research

The following pages should **not** be edited manually:

- Error
- Components/Search/Database
- Component

To edit a page, follow these steps:

1. On the [GitHub page](https://github.com/dwhieb/Nisinoon) for the site, find the page you wish to edit inside the `pages/` folder, and click the file with the `.md` extension (e.g. `About.md`).
2. Click the edit icon ✏️ towards the top right.
3. Edit the page content.
   - Pages are written in [Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).
   - HTML is valid Markdown, so you can use HTML tags as well.
   - You can't use Markdown *inside* HTML tags. If you use an HTML tag, everything inside that tag needs to be written in HTML as well.
   - You may see some {{curly braces}}. This is part of a templating language that allows you to inject variables and other data in the page. Avoid editing code within braces.
4. At the top right of the page, click the green **Commit changes...** button. A box will pop up where you can leave a message describing your changes.
   - Choose the **Create a new branch for this commit and start a pull request** option.
   - Click the green **Propose changes** button in the bottom right of the box.
5. A new pull request draft will be started. Click the green **Create pull request** button towards the bottom right.
6. Wait for a developer to review your changes and merge them into the live version of the site.

## Bibliography

The `bibliography/` folder contains all the scripts and data needed for building the Bibliography page.

Since the bibliography is no longer updated regularly, retrieving the data and building the bibliography page/PDF is no longer done automatically during the build process. If needed, run the scripts locally instead (from the `bin/` folder).

The linguistics stylesheet comes from [here](https://github.com/citation-style-language/styles/blob/master/generic-style-rules-for-linguistics.csl). You can find other stylesheets in that same repository. Zotero seems to use that repo for its list, so you can test out different styles in Zotero.

Creating the PDF must be done manually using the Prince UI on the local or production versions of the site. (You used to be able to do it during the build process because you were using a static site generator that produced the complete HTML for the page in the `dist/` folder. This is no longer the case. In order to produce the PDF during build, you'd have to run a local server, request the page, and run Prince on it, all on GitHub. Not worth it.)

## Data

The `data/` folder contains all the scripts needed for fetching and transforming the project data for use in the website database.

Since the data for the project is no longer updated regularly, retrieving the data is no longer done automatically during the build process. If needed, run the scripts locally instead (from the `bin/` folder).

In order to access files from the Nisinoon project using the Google Drive API, the email address of the Google APIs project needs to be given access to those files.

You can create credentials and download the JSON file for them [here](https://console.cloud.google.com/iam-admin/serviceaccounts/details/104392651974587359187/keys?project=digital-linguistics&supportedpurview=project).

## Release & Versioning

Version number is for the *data*, not the website.

To create a data release to Zenodo:

1. Increment version number (`npm version minor`) and commit the change.
   - Dates and versions in documentation (license, citation) and Express locals (via `meta.json`) are updated automatically when `npm version` is run. (See the `version` script in `package.json`.)
2. Create a release **FROM THE `DATA` BRANCH**.

## Page Variables

| Variable     | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| `{PageName}` | The page name. Used by Handlebars to check for the current page. |
| `cssClass`   | The value to use in `<main class={name}-page>`.                  |
| `title`      | The page title. Will be displayed in the browser tab.            |

## Environment Variables

| Variable   | Description                          |
| ---------- | ------------------------------------ |
| `NODE_ENV` | `localhost` \| `CI` \| `production`  |
| `PORT`     | The port to connect to.              |
