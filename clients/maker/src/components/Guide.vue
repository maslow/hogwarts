<template>
  <div class="guide">
    <h1>{{ msg }}</h1>
    <Button @click="changeMode">Change </Button>
    <codemirror v-model="code" :options="options" width="600px" height="600px"></codemirror>
    <pre>
        {{code}}
      </pre>
  </div>
</template>

<script>
import codemirror from './codemirror.vue';

export default {
  components: {
    codemirror
  },
  name: 'guide',
  data() {
    return {
      msg: 'Gui de!',
      code: 'var i = 0;',
      options: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'solarized dark',
        lineNumbers: true,
        line: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lineWrapping: true,
      }
    }
  },
  methods: {
    changeMode() {
      this.code = "<?php echo 'hi';?>"
      this.options.mode = 'text/x-php'
    }
  },
  mounted() {
    // Hack css for the bug in codemirror.vue
    setTimeout(() => {
      document.querySelector('.CodeMirror-gutters').style.left = '0'
    }, 0)
  },
  computed: {
    editor() {
      return this.$refs.codeEditor.editor
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

.CodeMirror {
  border: 1px solid #eee;
  height: 800px;
}
</style>
