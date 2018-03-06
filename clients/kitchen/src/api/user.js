import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {
  Login,
  Register
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
