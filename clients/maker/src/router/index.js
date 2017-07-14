import Vue from 'vue'
import Router from 'vue-router'

const UserCourses = () => import('@/components/UserCourses')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: UserCourses
    }
  ]
})
