<template>
  <svg :class="className" :width="size.width" :height="size.height">
    <use :xlink:href="glyph" />
  </svg>
</template>

<script>
export default {
  name: 'icon',
  props: {
    className: {
      type: String
    },
    glyph: null,
    size: {
      type: Object,
      default: function() {
        return {
          width: null,
          height: null
        }
      }
    }
  }
}
</script>

<style scoped>
.icon {
  display: inline-block;
}
</style>
