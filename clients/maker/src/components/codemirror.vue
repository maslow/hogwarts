<template>
  <textarea>
  </textarea>
</template>

<script>
const CodeMirror = require('codemirror')
require('codemirror/lib/codemirror.css')
require('codemirror/mode/meta')

function loadMode(mode) {
  //console.log(mode)
  var isCustomMode = !!CodeMirror.modes[mode]

  var m = CodeMirror.findModeByMIME(mode)

  if (!m)
    m = CodeMirror.findModeByName(mode)

  if (!m)
    m = CodeMirror.findModeByExtension(mode)

  if (!m)
    m = CodeMirror.findModeByFileName(mode)

  //console.log('mode', m)

  // require language
  if (m && m !== 'null')
    require('codemirror/mode/' + m.mode + '/' + m.mode + '.js')

  return m
}

function loadTheme(theme) {
  // theme config
  if (theme && theme == 'solarized light')
    theme = 'solarized'

  if (theme && theme == 'solarized dark')
    theme = 'solarized'

  // require theme
  if (theme)
    require('codemirror/theme/' + theme + '.css')

}

export default {
  name: 'codemirror',
  data: function () {
    return {
      content: ''
    }
  },
  props: {
    width: String,
    height: String,
    code: String,
    value: String,
    unseenLines: Array,
    marker: Function,
    options: {
      type: Object,
      required: true
    },
  },
  created: function () {
    let mode = loadMode(this.options.mode)
    if (mode)
      this.options.mode = mode.mime

    if (!this.width)
      this.width = 'auto'

    if (!this.height)
      this.height = 'auto'

    loadTheme(this.options.theme)
  },
  mounted: function () {
    var _this = this
    this.editor = CodeMirror.fromTextArea(this.$el, this.options)
    this.editor.setValue(this.code || this.value || this.content)
    this.editor.on('change', cm => {
      this.content = cm.getValue()
      this.$emit('change', this.content)
      this.$emit('input', this.content)
    })

    this.resize()

    let events = [
      'changes',
      'beforeChange',
      'cursorActivity',
      'keyHandled',
      'inputRead',
      'electricInput',
      'beforeSelectionChange',
      'viewportChange',
      'swapDoc',
      'gutterClick',
      'gutterContextMenu',
      'focus',
      'blur',
      'refresh',
      'optionChange',
      'scrollCursorIntoView',
      'update'
    ]
    events.forEach(e => {
      this.editor.on(e, (a, b, c) => {
        this.$emit(e, a, b, c)
      })
    })
    this.$emit('ready', this.editor)
    this.unseenLineMarkers()

    // prevents funky dynamic rendering
    window.setTimeout(function () {
      _this.editor.refresh()
    }, 0)
  },
  beforeDestroy: function () {

    // garbage cleanup
    this.editor.doc.cm.getWrapperElement().remove()
  },
  watch: {
    options: {
      deep: true,
      handler(options, oldOptions) {
        var key
        for (key in options) {
          if (key === 'mode') {
            let mode = loadMode(options[key])
            this.options.mode = mode.mime
          }
          if (key === 'theme')
            loadTheme(options[key])

          this.editor.setOption(key, options[key])
        }
      }
    },
    width(n, o) {
      this.resize()
    },
    height(n, o) {
      this.resize()
    },
    code: function (newVal, oldVal) {
      let editor_value = this.editor.getValue()
      if (newVal !== editor_value) {
        var scrollInfo = this.editor.getScrollInfo()
        this.editor.setValue(newVal)
        this.content = newVal
        this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
      }
      this.unseenLineMarkers()
    },
    value: function (newVal, oldVal) {
      let editor_value = this.editor.getValue()
      if (newVal !== editor_value) {
        var scrollInfo = this.editor.getScrollInfo()
        this.editor.setValue(newVal)
        this.content = newVal
        this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
      }
      this.unseenLineMarkers()
    }
  },
  methods: {
    resize() {
      this.editor.setSize(this.width, this.height)
    },
    unseenLineMarkers: function () {
      var _this = this
      if (_this.unseenLines !== undefined && _this.marker !== undefined) {
        _this.unseenLines.forEach(line => {
          var info = _this.editor.lineInfo(line)
          _this.editor.setGutterMarker(line, "breakpoints", info.gutterMarkers ? null : _this.marker())
        })
      }
    }
  }
}
</script>
