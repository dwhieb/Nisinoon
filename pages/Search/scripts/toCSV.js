import parser from 'papaparse'

function mergeFields(tokens, field) {
  return tokens.map(token => token[field] || `—`).join(`; `)
}

function preprocessComponent(data) {

  // WARNING: Do not alter the original component
  const component = structuredClone(data)

  // Component Fields

  component.baseCategories = component.baseCategories?.join(`; `)
  component.matchAI        = component.matches.AI
  component.matchII        = component.matches.II
  component.matchTA        = component.matches.TA
  component.matchTI        = component.matches.TI
  component.tags           = component.tags?.join(`; `)

  // Stem Fields

  if (component.stems) {

    const { stems } = component

    component[`stems.forms`]         = mergeFields(stems, `form`)
    component[`stems.UR`]            = mergeFields(stems, `UR`)
    component[`stems.glosses`]       = mergeFields(stems, `gloss`)
    component[`stems.categories`]    = mergeFields(stems, `category`)
    component[`stems.subcategories`] = mergeFields(stems, `subcategory`)
    component[`stems.secondary`]     = mergeFields(stems, `secondary`)
    component[`stems.sources`]       = mergeFields(stems, `sources`)

  }

  // Token Fields

  if (component.tokens) {

    const { tokens } = component

    component[`sources.forms`]         = mergeFields(tokens, `form`)
    component[`sources.UR`]            = mergeFields(tokens, `UR`)
    component[`sources.PA`]            = mergeFields(tokens, `PA`)
    component[`sources.orthographies`] = mergeFields(tokens, `orthography`)
    component[`sources.glosses`]       = mergeFields(tokens, `gloss`)
    component[`sources.notes`]         = mergeFields(tokens, `notes`)
    component[`sources.bibliography`]  = mergeFields(tokens, `bibliography`)
    component[`sources.speakers`]      = mergeFields(tokens, `speaker`)

  }

  // Array Fields

  delete component.matches
  delete component.stems
  delete component.tokens

  return component

}

/**
 * Converts the results array to CSV.
 */
export default function toCSV(components) {
  return parser.unparse(components.map(preprocessComponent))
}
