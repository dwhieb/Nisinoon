import Database from './Database.js'

const db = new Database

await db.initialize()

export default db
