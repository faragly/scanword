<template>
  <main>
    <div class="scanword" :class="classModifiers">
      <div class="scanword__cell" @mouseover="highlight(cell)" @click="activate(cell)" v-bind:class="[cell.classes, {'scanword__cell--active': active.cells.indexOf(cell.id) > -1, 'scanword__cell--highlighted': highlighted.indexOf(cell.id) > -1, 'scanword__cell--focused': active.focused === cell.id}]" v-for="cell in cells" :coordinates="cell.coordinates" :key="cell.id">
        {{ cell.text }}
        <editable-cell :ref="cell.id" :reference="cell.id" v-if="cell.editable"></editable-cell>
        <div v-if="cell.arrows">
          <icon v-for="(arrow, key) in cell.arrows" :size="arrowSize" :glyph="arrow" :key="key"></icon>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import Icon from './Icon'
import EditableCell from './EditableCell'
import ArrowTopLeftX from './../assets/arrows/top-left-x.svg'
import ArrowTopLeftY from './../assets/arrows/top-left-y.svg'
import ArrowTopX from './../assets/arrows/top-x.svg'
import ArrowTopRightX from './../assets/arrows/top-right-x.svg'
import ArrowTopRightY from './../assets/arrows/top-right-y.svg'
import ArrowBottomLeftX from './../assets/arrows/bottom-left-x.svg'
import ArrowBottomLeftY from './../assets/arrows/bottom-left-y.svg'
import ArrowBottomX from './../assets/arrows/bottom-x.svg'
import ArrowBottomY from './../assets/arrows/bottom-y.svg'
import ArrowBottomRightX from './../assets/arrows/bottom-right-x.svg'
import ArrowBottomRightY from './../assets/arrows/bottom-right-y.svg'
import ArrowRightX from './../assets/arrows/right-x.svg'
import ArrowRightY from './../assets/arrows/right-y.svg'
import ArrowLeftY from './../assets/arrows/left-y.svg'

export default {
  name: 'ScanWordCreate',
  components: {
    Icon,
    EditableCell
  },
  props: {
    theme: {
      type: String,
      default: null
    },
    size: {
      type: Object,
      default: function() {
        return {
          width: 20,
          height: 25
        }
      }
    },
    arrowSize: {
      type: Object,
      default: function() {
        return {
          width: 45,
          height: 45
        }
      }
    }
  },
  data () {
    return {
      ArrowTopLeftX,
      ArrowTopLeftY,
      ArrowTopX,
      ArrowTopRightX,
      ArrowTopRightY,
      ArrowBottomLeftX,
      ArrowBottomLeftY,
      ArrowBottomX,
      ArrowBottomY,
      ArrowBottomRightX,
      ArrowBottomRightY,
      ArrowRightX,
      ArrowRightY,
      ArrowLeftY
    }
  },
  beforeCreate() {
    // eslint-disable-next-line
    console.clear()
  },
  created () {

  },
  computed: {

  },
  methods: {

  },
  beforeDestroy: function () {

  }
}
</script>

<style lang="scss" scoped>

</style>
