<template>
  <div id="app">
    <section class="container">
      <nav class="bd-tabs">
        <div class="tabs is-centered">
          <ul>
            <li v-for="tab in tabs" :class="{'is-active': tab.id === active}" :key="tab.id">
              <router-link :to="tab.path">{{ tab.text }}</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </section>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'home',
  beforeCreate() {
    // eslint-disable-next-line
    console.clear()
	},
  data () {
    return {
      active: null,
      tabs: [
        { id: 1, name: 'scanword', text: 'Сканворд', path: '/' },
        { id: 2, name: 'scanword_create', text: 'Создание сканворда', path: '/create' }
      ]
    }
  },
  watch: {
    "$route": {
      immediate: true,
      handler() {
        this.active = this.tabs.filter(item => this.$route.name === item.name)[0].id
      }
    }
  }
}
</script>

<style lang="scss">
@import './assets/styles/normalize.css';

html {
  height: 100%;
}

body {
  min-height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

.bd-tabs {
  margin-bottom: 2rem;
}
</style>
