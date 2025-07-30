import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// Hàm khởi tạo connection
export async function createDbConnection() {
  sqlite3.verbose()
  const db = await open({
    filename: 'database/database.sqlite',
    driver: sqlite3.Database,
  })

  return db
}
