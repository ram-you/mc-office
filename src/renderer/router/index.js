import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('../views/home/Home');

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      component:Home
    },
    {
      path: '/login',
      name: 'login',
      meta: { transitionName:'zoom'},
      component: () =>
        import ('../views/Login')
    },
    {
      path: '/about',
      name: 'about',
      meta: { transitionName:'zoom'},
      component: () =>
        import ('../views/About')
    },
    {
      path: '/data-tables',
      name: 'DataTables',
      title: 'DataTables',
      meta: { transitionName:'slide'},
      component: () =>
        import ('../views/DataTables')
    },
    {
      path: '/invoices',
      name: 'invoices', 
      meta: { transitionName:'slide'}, 
      component: () =>
        import ('../views/billing/invoice/list')
    },
    {
      path: '/invoice',
      name: 'invoice',
      meta: { transitionName:'slide'},
      component: () =>
        import ('../views/billing/invoice/item')
    },
    {
      path: '/settings',
      name: 'settings',
      meta: { transitionName:'zoom'},
      component: () =>
        import ('../views/settings/index')
    },
    {
      path: '/invoice/:id',
      name:'invoice detail',
      query: { number: ':name(\\d+)?' },
      props: (route) => ({ id: route.params.id, number: route.query.number }),
      meta: { transitionName:'slide'},
      component: () =>
        import ('../views/billing/invoice/item')
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})