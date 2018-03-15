import $ from 'jquery'
import Identity from './identity'

let G_API = Identity.G_API

export default {
  Login,
  Register,
  validateToken,
  captcha
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

function Register(email, password, captcha_text, captcha_token) {
  return $.ajax({
    url: G_API + '/createUser',
    method: 'post',
    data: {
      email,
      password,
      captcha_text,
      captcha_token
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

function captcha(){
  return $.ajax({
    url: G_API + '/captcha',
    method: 'get'
  })
}