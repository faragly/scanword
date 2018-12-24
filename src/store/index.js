import Vue from 'vue'
import Vuex from 'vuex'
import scanwordModule from './modules/scanword'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    scanword: scanwordModule
  }
})

store.subscribe((mutation, state) => {
  if (mutation.type === 'scanword/changeContent') {
    localStorage.setItem('scanwordClue', JSON.stringify(state));
  }
})

export default store