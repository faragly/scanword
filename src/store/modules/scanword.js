import Vue from 'vue'
import {version} from '../../../package.json'

export default {
  namespaced: true,
  state() {
    return {
      version: version,
      cells: {}
    }
  },
  mutations: {
    initialiseStore(state) {
      if(localStorage.getItem('scanwordClue')) {
        let store = JSON.parse(localStorage.getItem('scanwordClue'));

        // Check the version stored against current. If different, don't load the cached version
        if(store.scanword.version == version) {
          this.replaceState(
            Object.assign(this.state, store)
          );
        } else {
          state.scanword.version = version;
        }
      }
    },
    changeContent(state, payload) {
      if (!state.cells[payload.reference]) {
        Vue.set(state.cells, payload.reference, {})
      }

      Vue.set(state.cells[payload.reference], 'content', payload.content)
    },
    changeFocus(state, payload) {
      if (!state.cells[payload.reference]) {
        Vue.set(state.cells, payload.reference, {})
      }

      Vue.set(state.cells[payload.reference], 'focused', payload.focused)
    }
  },
  getters: {
    content: state => reference => {
      return state.cells[reference] ? state.cells[reference].content : ''
    }
  }
}
