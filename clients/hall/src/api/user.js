import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {
  Login,
  Register
}

function Login(email, password) {
  return $.ajax({
    url: G_API + '/tokens',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

function Register(email, password) {
  return $.ajax({
    url: G_API + '/user',
    method: 'post',
    data: {
      email,
      password
    }
  })
}
