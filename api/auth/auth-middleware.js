const Auth = require('./auth-model')

async function checkUsernameFree(req, res, next) {
    try {
      const users = await Auth.findBy({ username: req.body.username })
      if (!users.length) next()
      else next({ status: 422, message: "username taken" })
    } catch (error) {
      next(error)
    }
}

async function checkUsernameExists(req, res, next) {
    try {
      const users = await Auth.findBy({ username: req.body.username })
      if (users.length) {
        req.user = users[0]
        next()
      }
      else next({ status: 401, message: "invalid credentials" })
    } catch (error) {
      next(error)
    }
}

function checkNecessaryFields(req, res, next) {
    if (!req.body.username || !req.body.password) {
        next({ status: 400, message: "username and password required"})
    }
    else next()
}

function checkPasswordLength(req, res, next) {
    if (req.body.password.trim().length < 3) 
      next({ status: 422, message: 'password must be longer than 3 chars' })
    else next()
}

module.exports = {
    checkUsernameFree,
    checkPasswordLength,
    checkNecessaryFields,
    checkUsernameExists
}