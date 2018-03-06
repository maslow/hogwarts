// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import identity from '@/api/identity'

Vue.config.productionTip = false

async function main() {
  await import('iview/dist/styles/iview.css')
  const iView = await import('iview')

  Vue.use(iView)

  router.beforeEach((to, from, next) => {
    // if (identity.isExpired() && to.path !== '/login' && to.path !== '/register') {
    //   router.push('/login')
    // } else 
    if (!identity.isExpired() && to.path === '/login') {
      router.push('/')
    } else {
      iView.LoadingBar.start()
      next()
    }
  })

  router.afterEach((to, from, next) => {
    iView.LoadingBar.finish()
  })

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
      App
    }
  })
}

main()
