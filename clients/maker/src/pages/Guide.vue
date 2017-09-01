<template>
  <div class="guide">
    <Button @click="changeMode">Change </Button>
    <br/>
    <codemirror v-model="code" :options="options" width="600px" height="600px" ref="codeEditor"></codemirror>
    <pre>
                  {{code}}
                </pre>
  </div>
</template>

<script>
import codemirror from '@/components/codemirror.vue'

export default {
  components: {
    codemirror
  },
  name: 'guide',
  data() {
    return {
      code: 'int main(){}',
      options: {
        tabSize: 4,
        theme: 'solarized dark',
        lineNumbers: true,
        mode: 'c',
        line: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      }
    }
  },
  methods: {
    changeMode() {
      // this.code = "<?php echo '';?>"
      // this.mode = "php"
      let s0 = "<"
      this.code = `
        <html lang="zh-CN">
          <body>
          <div>hi</div>
          </body>
        </html>
      `
      this.options.mode = "html"
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
