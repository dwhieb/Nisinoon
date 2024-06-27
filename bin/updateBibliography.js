import createBibliographyHTML from '../bibliography/createBibliographyHTML.js'
import getBibliographyData    from '../bibliography/getBibliographyData.js'

await getBibliographyData()
await createBibliographyHTML()
