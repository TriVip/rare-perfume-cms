import { createDbConnection } from '../database/db.js'
import { createHash } from 'crypto'

export async function findUser(id) {
  const db = await createDbConnection()
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id])
  return user
}

export async function findUserByEmail(email) {
  const db = await createDbConnection()
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email])
  return user
}

export async function attemptLogin(email, password) {
  const hashedPassword = createHash('md5').update(password).digest('hex')
  const user = await findUserByEmail(email)

  if (!user || user?.password !== hashedPassword) {
    return null
  }

  return user
}

export async function insertUser(user) {
  const db = await createDbConnection()
  const hashedPassword = createHash('md5').update(user.password).digest('hex')
  await db.exec('INSERT INTO users (id, email, password, name, role, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [
    user.id,
    user.email,
    hashedPassword,
    user.name,
    user.role,
    user.avatar,
    user.created_at,
  ])
  return true
}
