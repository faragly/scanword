import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import store from './store/index'

Vue.use(Buefy)
Vue.config.productionTip = false

const eventHub = new Vue() // Single event hub

// Distribute to components using global mixin
Vue.mixin({
    data: function () {
        return {
            eventHub: eventHub
        }
    }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
