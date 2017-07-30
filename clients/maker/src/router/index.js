import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/components/UserCourses')
    },
    {
      path: '/courses',
      component: () => import('@/components/UserCourses')
    },
    {
      path: '/guide',
      component: () => import('@/components/Guide')
    },
    {
      path: '/course/:id',
      component: () => import ('@/components/Course')
    },
    {
      path: '/section-codes/:sid',
      component: () => import ('@/components/SectionCodes')
    },
    {
      path: '/section-tests/:sid',
      component: () => import ('@/components/SectionTests')
    }
  ]
})
