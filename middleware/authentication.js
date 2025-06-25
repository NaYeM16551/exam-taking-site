const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid1')
  }
  const token = authHeader.split(' ')[1]

   {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId);

    

    if(user.currentSessionID!==payload.sessionId)
    {
      throw new UnauthenticatedError('Session expired, please log in again');
    }


    // attach the user to the job routes
    req.user = { userId: payload.userId }
    next()
  } 
}

module.exports = auth
