# Bibliography

This folder contains all the scripts and data needed for building the Bibliography page.

The following scripts should be only be run during deployment, or manually as needed on your local machine, since the Zotero bibliography isn't updated regularly.

- `getBibliographyData.js`
- `createBibliographyHTML.js`

The linguistics stylesheet comes from [here](https://github.com/citation-style-language/styles/blob/master/generic-style-rules-for-linguistics.csl). You can find other stylesheets in that same repository. Zotero seems to use that repo for its list, so you can test out different styles in Zotero.

Creating the PDF must be done manually using the Prince UI on the local or production versions of the site. (You used to be able to do it during the build process because you were using a static site generator that produced the complete HTML for the page in the `dist/` folder. This is no longer the case. In order to produce the PDF during build, you'd have to run a local server, request the page, and run Prince on it. Not worth it.)