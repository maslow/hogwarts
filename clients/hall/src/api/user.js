import $ from 'jquery'
import Identity from './identity'

let G_API = Identity.G_API

export default {
  Login,
  Register,
  validateToken
}

function Login(email, password) {
  return $.ajax({
    url: G_API + '/login',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

function Register(email, password) {
  return $.ajax({
    url: G_API + '/createUser',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

function validateToken(){
  const token = Identity.getAccessToken()
  return $.ajax({
    url: G_API + '/validateToken',
    method: 'post',
    data: {
      token
    }
  })
}