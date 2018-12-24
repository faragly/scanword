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
  name: 'ScanWord',
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
      ArrowLeftY,
      scanword: {
        issues: []
      },
      cells: [],
      active: {
        direction: null,
        focused: null,
        cells: []
      },
      highlighted: [],
      debug: false
    }
  },
  beforeCreate() {
    this.$store.commit('scanword/initialiseStore');
  },
  created () { // when the Vue app is booted up, this is run automatically.
    var self = this
    axios.get('./../../data/scanword.json').then(response => {
      self.scanword = response.data
      self.cells = self.filteredIssues()
    })

    self.eventHub.$on('cell-navigation', self.cellNavigation)
  },
  computed: {
    classModifiers () {
      let modifiers = ['scanword--size-' + this.size.width + 'x' + this.size.height];

      if (this.theme) {
        modifiers.push('scanword--' + this.theme)
      }

      return modifiers
    }
  },
  methods: {
    getWordCoordinates (cellid) {
      let self = this
      let item = self.scanword.issues.find(issue => {
        return cellid === 's' + ((issue.end.x - issue.start.x + 1) * (issue.end.y - issue.start.y + 1)) + '_x' + issue.start.x + 'y' + issue.start.y
      })
      let length = item.answer ? item.answer.length : item.length
      let result = [cellid]

      for (let i = 0; i < length; i++) {
        let x = item.arrow.direction === 'horizontal' ? item.arrow.x + i : item.arrow.x
        let y = item.arrow.direction === 'horizontal' ? item.arrow.y : item.arrow.y + i
        result.push('x' + x + 'y' + y)
      }

      return result
    },
    filteredIssues () {
      let self = this
      let arr = []
      let cells = []

      self.scanword.issues.forEach(item => {
        let length = item.answer ? item.answer.length : item.length
        let horizontal = item.arrow.direction === 'horizontal'
        let direction = horizontal ? 'X' : 'Y'
        let size = {
          x: item.end.x - item.start.x + 1,
          y: item.end.y - item.start.y + 1
        }
        let id = 's' + (size.x * size.y) + '_x' + item.start.x + 'y' + item.start.y
        let arrow
        let side = ''

        arr.push({
          id,
          text: item.text,
          editable: false,
          direction,
          coordinates: item.start,
          classes: ['start-' + item.start.x, 'end-' + item.end.x, 'start-y-' + item.start.y, 'end-y-' + item.end.y]
        })

        if (item.arrow.x < item.start.x) {
          side = 'Left'
        } else if (item.arrow.x > item.start.x) {
          side = 'Right'
        }

        if (item.arrow.y < item.start.y) {
          arrow = 'ArrowTop' + side + direction
        } else if (item.arrow.y === item.start.y) {
          arrow = 'Arrow' + side + direction
        } else if (item.arrow.y > item.start.y) {
          arrow = 'ArrowBottom' + side + direction
        }

        for (let i = 0; i < length; i++) {
          let x = horizontal ? item.arrow.x + i : item.arrow.x
          let y = horizontal ? item.arrow.y : item.arrow.y + i
          let cid = 'x' + x + 'y' + y
          let cellData = {
            id: cid,
            classes: [
              'scanword__cell--empty',
              'start-' + x,
              'end-' + x,
              'start-y-' + y,
              'end-y-' + y
            ],
            arrows: {},
            partOf: [id],
            editable: true,
            coordinates: {
              x, y
            }
          }
          let index = cells.findIndex(item => item.id === cellData.id)

          if (index > -1) {
            cells[index].partOf.push(id)
          }

          if (index > -1 && i === 0) {
            cells[index].arrows[arrow] = self[arrow]
          } else if (index === -1 && i === 0) {
            cellData.arrows[arrow] = self[arrow]
          }

          if (index === -1) {
            cells.push(cellData)
          }
        }
      })

      return arr.concat(cells)
    },
    highlight (item) {
      let self = this

      self.highlighted = []

      if (item === undefined || !item.partOf) {
        return
      }

      self.highlighted = item.partOf.reduce((result, currentItem) => {
        result = result.concat(self.getWordCoordinates(currentItem))
        return result
      }, [])
    },
    activate (item) {
      let self = this
      let cellid = item.id

      if (item === undefined || (self.active.cells.length && self.active.cells[0] === cellid)) {
        self.active = {
          direction: null,
          focus: null,
          cells: []
        }
      } else {
        let arrows = item.arrows ? Object.keys(item.arrows) : []
        self.active.direction = arrows.length === 1 && arrows[0].endsWith('Y') ? 'Y' : 'X'

        if (item.partOf) {
          cellid = item.partOf.length === 1 ? item.partOf[0] : item.partOf.filter(currentId => {
            return self.cells.find(cell => cell.id === currentId).direction === self.active.direction
          })[0]
        }

        self.active.cells = self.getWordCoordinates(cellid)
        self.active.focused = item.partOf ? item.id : self.active.cells[1]

        if (self.$refs[self.active.focused] && Array.isArray(self.$refs[self.active.focused]) && self.$refs[self.active.focused].length) {
          self.$refs[self.active.focused][0].$el.focus()
        }
      }
    },
    cellNavigation (event, payload) {
      let self = this
      let focusedCell = self.cells.find(item => item.id === self.active.focused)
      let coordinates = Object.assign({}, focusedCell.coordinates)
      let cells = self.cells.filter(item => {
        return item.editable && (item.coordinates.x === coordinates.x || item.coordinates.y === coordinates.y)
      })
      let cellsFiltered = {
        left: cells.filter(item => item.coordinates.x < coordinates.x).sort((a, b) => b.coordinates.x - a.coordinates.x),
        up: cells.filter(item => item.coordinates.y < coordinates.y).sort((a, b) => b.coordinates.y - a.coordinates.y),
        right: cells.filter(item => item.coordinates.x > coordinates.x).sort((a, b) => a.coordinates.x - b.coordinates.x),
        down: cells.filter(item => item.coordinates.y > coordinates.y).sort((a, b) => a.coordinates.y - b.coordinates.y)
      }
      let direction

      if (
        event.keyCode > 64 && event.keyCode < 91 || // если введена буква
        [186, 188, 190, 219, 221, 222].indexOf(event.keyCode) > -1 || // дополнительные кириллические символы
        (event.keyCode === 39 && payload.caretOffset === payload.textLength)
        /* || // right И курсор не в начале строки или строка пустая
        ([8, 13, 27].indexOf(event.keyCode) > -1 && payload.textLength) // backspace или space или escape И непустая строка */
      ) {
        direction = 'right'
      } else if (
        (event.keyCode === 37 && payload.caretOffset === 0) || // left И курсор в начале строки
        (event.keyCode === 8 && !payload.textLength) // backspace и пустая строка
      ) {
        direction = 'left'
      } else if ([38, 40].indexOf(event.keyCode) > -1) { // up ИЛИ down
        direction = event.keyCode === 38 ? 'up' : 'down'
      } else {
        return
      }

      let targetCell = cellsFiltered[direction].length ? cellsFiltered[direction][0] : focusedCell

      self.activate(targetCell)
    }
  },
  beforeDestroy: function () {
    this.eventHub.$off('cell-navigation', this.cellNavigation)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
main {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

$grid-cols: 20;
$grid-rows: 25;
$grid-gaps: $grid-cols - 1;

@mixin scanword($gap-space: 1px) {
  $col-size:  50px;
  $gap-total: $gap-space * $grid-gaps;
  // Space to substract by each col for gaps
  $gap-subst: $gap-total / $grid-cols;

  display: grid;
  grid-template-columns: repeat(#{$grid-cols}, #{$col-size - $gap-subst});
  grid-template-rows: repeat(#{$grid-rows}, #{$col-size - $gap-subst});
  grid-gap: $gap-space;
  grid-auto-flow: dense;
}

.scanword {
  @include scanword();

  &--gvozd-sezona {
    @include scanword(0);

    .scanword__cell {
      border-width: 1px;

      &:not(.scanword__cell--empty) {
        background-color: #4288b6;
        box-shadow: 3px 3px 0 rgba(0, 0, 0, .65);
        &.scanword__cell--active {
          background-color: darken(#4288b6, 10%);
        }
      }
    }
  }

  &__cell {
    border: 2px solid rgba(0,0,0,.2);
    &:not(&--empty) {
      padding: .1vh;
      background-color: #4053ae;
      font-size: 8.5px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      word-break: break-word;
    }
    &--empty {
      position: relative;
      transition: background-color .1s linear;
      svg {
        position: absolute;
        left: 0;
        opacity: .65;
      }
      span {
        position: absolute;
        font-size: 9px;
        left: 3px;
        bottom: 3px;
        opacity: .3;
      }
    }
    &--highlighted {
      background-color: #eeff00;
      &.scanword__cell--active {
        background-color: darken(#eeff00, 5%);
      }
      &.scanword__cell--focused {
        background-color: darken(#eeff00, 10%);
      }
    }
    &--active {
      background-color: rgba(0,0,0,.1);
    }
    &--focused {
      background-color: rgba(0,0,0,.2);
    }
  }
}

// CSS Grid grid spans

@for $i from 1 through $grid-cols {
  .span-#{$i}    { grid-column:  span #{$i} } // Span cols across tracks
  .start-#{$i}   { grid-column-start: #{$i} } // Define a horizontal start point
  .end-#{$i}     { grid-column-end:   #{$i} } // Define an horizontal end point
}

@for $i from 1 through $grid-rows {
  .start-y-#{$i} { grid-row-start:    #{$i} } // Define a vertical start point
  .end-y-#{$i}   { grid-row-end:      #{$i} } // Define an vertical end point
}
</style>
