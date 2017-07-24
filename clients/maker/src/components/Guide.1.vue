<template>
  <div class="guide">
    <h1>{{ msg }}</h1>
    <CodeMirror :code="code" :options="options" ref="codeEditor"></CodeMirror>
  </div>
</template>

<script>
import CodeMirror from './codemirror.vue'

export default {
  components: {
    CodeMirror
  },
  name: 'guide',
  data() {
    return {
      msg: 'Guide!',
      code: 'var i = 0;',
      options: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'solarized dark',
        lineNumbers: true,
        line: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lineWrapping: true
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.codeEditor.editor
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
</style>
