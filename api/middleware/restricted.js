const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../secrets");

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  console.log(token)
  if (!token) {
    return next({ status: 401, message: 'token required' })
  }
      
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'token invalid' })
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
};
