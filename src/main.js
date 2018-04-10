// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import './assets/reset.scss'
import 'element-ui/lib/theme-chalk/index.css'

// var echarts = require('echarts')
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 使用element-ui
Vue.use(ElementUI)
// 引入axios
Vue.prototype.$http = axios
Vue.prototype.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

var EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
  $eventBus: {
    get: function () {
      return EventBus
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

Vue.config.devtools = true
