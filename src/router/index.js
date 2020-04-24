import Vue from 'vue'
import VueRouter from 'vue-router'
// 登录组件
import Login from '../components/Login.vue'
// home组件
import Home from '../components/Home.vue'
// home的子组件welcome组件
import Welcome from '../components/Welcome.vue'
// home的子组件菜单组件Users
import Users from '../components/user/Users.vue'
Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users }
    ]
  }
]
const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数表‘放行’，next('/'):强制跳转路径
  // if (to.path === './login') return next()
  // 获取token
  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  // next()
  const tokenStr = sessionStorage.getItem('token')
  const path = to.path
  if (path === '/login') {
    next()
    return
  }
  if (tokenStr) {
    if (path === '/') {
      next({
        path: './login'
      })
    } else {
      next()
    }
  } else {
    next({
      path: '/login'
    })
  }
})
export default router
