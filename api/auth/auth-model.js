const db = require('../../data/dbConfig')

function find() {
  return db('users').select('user_id', 'username')
}

function findBy(filter) {
  return db('users')
    .where(filter)
}

function findById(user_id) {
  return db('users')
    .where('id', user_id)
    .first()
}

async function add(user) {
  const [id] = await db('users').insert(user)
  return findById(id)
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add,
}