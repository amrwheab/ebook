const expressJwt = require('express-jwt');

function expressJwtMid () {
  return expressJwt({
    secret: process.env.JWTSECRET, 
    algorithms: ['HS256']
  }).unless({
    path: [
      '/user/login',
      '/user/register',
      '/user/getuserfromtoken/',
      '/departs/getdeparts',
      '/auther/getauthers'
    ]
  })
}

module.exports = expressJwtMid();