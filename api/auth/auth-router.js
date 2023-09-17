const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Auth = require('./auth-model')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../secrets"); 
const {
  checkPasswordLength,
  checkUsernameFree,
  checkNecessaryFields,
  checkUsernameExists
} = require('./auth-middleware')

router.post('/register', checkNecessaryFields, checkPasswordLength, checkUsernameFree, (req, res, next) => {
  const { username, password} = req.body
  const hash = bcrypt.hashSync(password, 8)

  Auth.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(next)
});

router.post('/login', checkNecessaryFields, checkUsernameExists, (req, res, next) => {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = buildToken(req.user)

    res.json({ 
      message: `welcome, ${req.user.username}`, 
      token: token
    })
    process.env.TOKEN = token
  } else {
    next({ status: 401, message: 'invalid credentials' })
  }
});

function buildToken(user) {

  const payload = {
    subject: user.id,
    username: user.username,
  }

  const options = {
    expiresIn: '1d',
  }

  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;
