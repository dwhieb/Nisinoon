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

  // Token Fields

  if (component.tokens) {

    const { tokens } = component

    component[`source.forms`]        = mergeFields(tokens, `form`)
    component[`source.UR`]           = mergeFields(tokens, `UR`)
    component[`source.PA`]           = mergeFields(tokens, `PA`)
    component[`source.orthography`]  = mergeFields(tokens, `orthography`)
    component[`source.glosses`]      = mergeFields(tokens, `gloss`)
    component[`source.notes`]        = mergeFields(tokens, `notes`)
    component[`source.bibliography`] = mergeFields(tokens, `bibliography`)
    component[`source.speaker`]      = mergeFields(tokens, `speaker`)

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
