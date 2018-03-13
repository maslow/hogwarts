<template>
  <textarea>
  </textarea>
</template>

<script>
const CodeMirror = require("codemirror");
require("codemirror/lib/codemirror.css");
require("codemirror/mode/meta");

export default {
  name: "codemirror",
  data: function() {
    return {};
  },
  props: {
    width: String,
    height: String,
    filename: String,
    value: String,
    options: {
      type: Object,
      required: true
    }
  },
  created: function() {
    if (!this.width) this.width = "auto";

    if (!this.height) this.height = "auto";

    loadTheme(this.options.theme);
  },
  mounted: function() {
    var _this = this;
    this.editor = CodeMirror.fromTextArea(this.$el, this.options);
    this.editor.on("change", cm => {
      let value = cm.getValue();
      this.$emit("input", value);
    });

    this.resize();

    let events = [
      "changes",
      "beforeChange",
      "cursorActivity",
      "keyHandled",
      "inputRead",
      "electricInput",
      "beforeSelectionChange",
      "viewportChange",
      "swapDoc",
      "gutterClick",
      "gutterContextMenu",
      "focus",
      "blur",
      "refresh",
      "optionChange",
      "scrollCursorIntoView",
      "update"
    ];
    events.forEach(e => this.editor.on(e, (a, b, c) => this.$emit(e, a, b, c)));

    this.$emit("ready", this.editor);
  },
  watch: {
    options: {
      deep: true,
      handler(options, oldOptions) {
        var key;
        for (key in options) {
          if (key === "mode") {
            let mode = loadMode(options[key])
            let mime = mode.mime || ""
            if(mime instanceof Array)
              mime = mime[0] || ""

            this.editor.setOption("mode", mime)
            continue
          }
          
          if (key === "theme") loadTheme(options[key])
          this.editor.setOption(key, options[key])
        }
      }
    },
    width() {
      this.resize();
    },
    height() {
      this.resize();
    },
    value: function(newVal, oldVal) {
      let editor_value = this.editor.getValue();
      if (newVal !== editor_value) {
        let scrollInfo = this.editor.getScrollInfo();
        this.editor.setValue(newVal);
        this.editor.scrollTo(scrollInfo.left, scrollInfo.top);
      }
    }
  },
  methods: {
    resize() {
      this.editor.setSize(this.width, this.height);
    }
  }
};

function loadMode(mode) {
  console.log(mode)
  var isCustomMode = !!CodeMirror.modes[mode];
  // console.log(`Mode: ${typeof mode}`)
  // console.log(mode.toLowerCase)
  var m = CodeMirror.findModeByFileName(mode);
  // console.log(m)
  if (!m) m = CodeMirror.findModeByName(mode);

  if (!m) m = CodeMirror.findModeByExtension(mode);

  if (!m) m = CodeMirror.findModeByMIME(mode);

  if (!m)
    return {
      mime: ""
    };

  if (m && m !== "null")
    require("codemirror/mode/" + m.mode + "/" + m.mode + ".js");

  return m;
}

function loadTheme(theme) {
  if (theme && theme == "solarized light") theme = "solarized";

  if (theme && theme == "solarized dark") theme = "solarized";

  // require theme
  if (theme) require("codemirror/theme/" + theme + ".css");
}
</script>
