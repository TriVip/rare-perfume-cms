import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { createHash } from 'crypto'

// Hàm khởi tạo connection
export async function createDbConnection() {
  sqlite3.verbose()
  const db = await open({
    filename: 'database/database.sqlite',
    driver: sqlite3.Database,
  })

  return db
}

export async function findUser(id) {
  const db = await createDbConnection()
  const user = await db.get(
    'SELECT * FROM users WHERE id = ?',
    [id]
  )
}

export async function attemptLogin(email, password) {
  const db = await createDbConnection()
  const user = await db.get(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, createHash('md5').update(password).digest('hex')]
  )
}

export async function insertUser(user) {
  const db = await createDbConnection()
  await db.exec(
    'INSERT INTO users (id, email, password, name, role, avatar, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user.id, user.email, user.password, user.name, user.role, user.avatar, user.createdAt]
  )
}
