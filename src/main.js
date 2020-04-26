import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入axios并配置
import axios from 'axios'
// axios请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通axios拦截器添加token验证
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 将axios挂载到vue的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 将 vue-table-with-tree-grid 注册为全局可用组件
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
