import Vue from 'vue'
import Router from 'vue-router'

const Hello = () => import('@/components/Hello')
const About = () => import('@/components/About')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: About
    },
    {
      path: '/hello',
      component: Hello
    }
  ]
})
