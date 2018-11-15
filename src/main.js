import Vue from 'vue'
import App from './App.vue'
import store from './store'

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
  render: h => h(App)
}).$mount('#app')
