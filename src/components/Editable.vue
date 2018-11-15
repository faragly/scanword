<template>
  <div class="editable-cell" contenteditable="true" @keydown="update"></div>
</template>

<script>
export default {
  name: 'editable',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  mounted: function () {
    this.$el.innerText = this.content
  },
  watch: {
    content: function () {
      this.$el.innerText = this.content
    }
  },
  methods: {
    update (event) {
      let text = event.code.startsWith('Key') ? event.key : ''

      if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        this.eventHub.$emit('cell-navigation', event)

        return
      }

      this.$emit('update:content', text)
      this.eventHub.$emit('update-cell-content', text)
    }
  }
}
</script>

<style lang="scss">
.editable-cell {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 150%;

  &:focus, &:active {
    outline: none;
  }
}
</style>