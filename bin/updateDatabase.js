import DataManager from './data/DataManager.js'

const manager = new DataManager

await manager.initialize()
await manager.fetchAllComponents()
await manager.convertAllComponents()
