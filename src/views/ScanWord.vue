<template>
  <div class="scanword">
    <ScanWord theme="gvozd-sezona" :arrowSize="{width: 48, height: 48}"/>
  </div>
</template>

<script>
// @ is an alias to /src
import ScanWord from '@/components/ScanWord.vue'

export default {
  name: 'scanword',
  components: {
    ScanWord
  }
}
</script>