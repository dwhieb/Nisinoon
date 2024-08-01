import DataManager from '../data/DataManager.js'

const manager = new DataManager

await manager.initialize()
await manager.fetchCitationKeys()
await manager.fetchLanguages()
await manager.fetchOrthographiesKey()
await manager.fetchAllComponents()
await manager.convertLanguages()
await manager.convertOrthographies()
await manager.convertAllComponents()
