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
      path: '/register',
      component: () => import('@/pages/Register')
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
      path: '/course/:id',
      component: () => import('@/pages/Course')
    },
    {
      path: '/section-codes/:sid',
      component: () => import('@/pages/SectionCode')
    },
    {
      path: '/section-tests/:sid',
      component: () => import('@/pages/SectionTestcase')
    },
    // {
    //   path: '/section-tests-blockly/:sid',
    //   component: () => import('@/pages/SectionTestBlockly')
    // },
    {
      path: '/section-docs/:sid',
      component: () => import('@/pages/SectionDocument')
    }
  ]
})
