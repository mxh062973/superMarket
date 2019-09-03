import Vue from 'vue' // 引入Vue
import App from './App.vue' // 引入App.vue 顶级组件
import router from './router' // 引入路由
import './assets/css/reset.css'; // 重置样式
import './assets/css/common.css'; // 公用样式

import ElementUI from 'element-ui'; // 引入JS组件
import 'element-ui/lib/theme-chalk/index.css'; // 引入css样式

// echarts
import echarts from 'echarts'

// 挂载在原型上
Vue.prototype.echarts = echarts

// 引入本地存储封装
import local from '@/utils/local'

Vue.use( ElementUI ) // 注册

// 路由守卫 拦截所有路由
router.beforeEach((to, from, next) => {
  // 获取token
  const token = local.get('user_token')

  // 判断
  if (token) {   // 如果有token 
    next() // 直接放行
  } else {
    if (to.path === '/login') { // 如果去的是登录 直接放行
      next() 
    } else {
      next({path: '/login'}) //  如果去的是其他页面，直接跳转到登录页面。
    }
  }
})


Vue.config.productionTip = false // 阻止生产提示

new Vue({ // 创建vue实例 
  router, // 传入路由，才能使用路由相关的组件和功能，router-view router-link
  render: h => h(App)  // 传入顶级组件App.vue 渲染
}).$mount('#app') // 挂载dom
