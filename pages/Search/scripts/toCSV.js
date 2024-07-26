import parser from 'papaparse'

function preprocessComponent(data) {

  // WARNING: Do not alter the original component
  const component = structuredClone(data)

  // Component Fields

  component.baseCategories = component.baseCategories.join(`; `)
  component.matchAI        = component.matches.AI
  component.matchII        = component.matches.II
  component.matchTA        = component.matches.TA
  component.matchTI        = component.matches.TI
  component.tags           = component.tags.join(`; `)

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
