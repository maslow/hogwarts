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
      component: () => import('@/pages/UserCourses')
    },
    {
      path: '/courses',
      component: () => import('@/pages/UserCourses')
    },
    {
      path: '/guide',
      component: () => import('@/pages/Guide')
    },
    {
      path: '/course/:id',
      component: () => import ('@/pages/Course')
    },
    {
      path: '/section-codes/:sid',
      component: () => import ('@/pages/SectionCodes')
    },
    {
      path: '/section-tests/:sid',
      component: () => import ('@/pages/SectionTestCodes')
    },
    {
      path: '/section-docs/:sid',
      component: () => import ('@/pages/SectionDocs')
    }
  ]
})
