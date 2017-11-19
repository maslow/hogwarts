import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: () => import('@/pages/Login')
    },
    {
      path: '/',
      component: () => import('@/pages/Courses')
    },
    {
      path: '/courses',
      component: () => import('@/pages/Courses')
    },
    {
      path: '/course/:id',
      component: () => import('@/pages/Course')
    },
    {
      path: '/job/:sid',
      component: () => import('@/pages/Job')
    }
  ]
})
