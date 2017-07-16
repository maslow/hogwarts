import Vue from 'vue'
import Router from 'vue-router'
import About from '@/components/About'
import UserCourses from '@/components/UserCourses'

//const UserCourses = () => import('@/components/UserCourses')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: UserCourses
    },
    {
      path: '/about',
      component: About
    }
  ]
})
