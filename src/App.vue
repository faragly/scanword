<template>
  <div id="app">
    <ScanWord theme="gvozd-sezona" :arrowSize="{width: 48, height: 48}"/>
  </div>
</template>

<script>
import ScanWord from './components/ScanWord.vue'

export default {
  name: 'app',
  components: {
    ScanWord
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
</style>
