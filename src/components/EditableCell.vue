<template>
  <div class="editable-cell" contenteditable="true" v-once @click="changeFocus(reference, true)" @keyup="setContent($event, reference)" @blur="changeFocus(reference, false)">{{ content }}</div>
</template>

<script>
export default {
  name: 'editable-cell',
  props: ['reference'],
  data() {
    return {}
  },
  computed: {
    content() {
      return this.$store.getters['scanword/content'](this.reference)
		}
  },
  methods: {
	  setContent: function (event, reference) {
      let text = event.code.startsWith('Key') || [186, 188, 190, 219, 221, 222].indexOf(event.keyCode) > -1 ? event.key : ''

      if (event.keyCode > 64 && event.keyCode < 91 || [8, 13, 27, 37, 38, 39, 40, 186, 188, 190, 219, 221, 222].indexOf(event.keyCode) > -1) {
        this.eventHub.$emit('cell-navigation', event, {
          caretOffset: this.getCaretCharacterOffsetWithin(this.$el),
          textLength: this.$el.innerText.length
        });
      }

      if (event.keyCode > 64 && event.keyCode < 91 || [8, 13, 27, 186, 188, 190, 219, 221, 222].indexOf(event.keyCode) > -1) {
        this.$el.innerText = text
        this.$store.commit('scanword/changeContent', {
          reference,
          content: text
        })
      }
    },
    changeFocus: function (reference, focused) {
      this.$store.commit('scanword/changeFocus', {
        reference,
        focused
      })
    },
    getCaretCharacterOffsetWithin: function (element) {
      let caretOffset = 0;
      let doc = element.ownerDocument || element.document;
      let win = doc.defaultView || doc.parentWindow;
      let sel;

      if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
          var range = win.getSelection().getRangeAt(0);
          var preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(element);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          caretOffset = preCaretRange.toString().length;
        }
      } else if ((sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }

      return caretOffset;
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