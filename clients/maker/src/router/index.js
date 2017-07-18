import Vue from 'vue'
import Router from 'vue-router'
import Guide from '@/components/Guide'
import UserCourses from '@/components/UserCourses'
import Course from '@/components/Course'
import Home from '@/components/Home'

//const UserCourses = () => import('@/components/UserCourses')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/courses',
      component: UserCourses
    },
    {
      path: '/guide',
      component: Guide
    },
    {
      path: '/course/:id',
      component: () => import ('@/components/Course')
    }
  ]
})
