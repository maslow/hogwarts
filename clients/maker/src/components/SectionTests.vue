<template>
  <div class="section-tests">
    <Button type="ghost" icon="checkmark" @click="save" :loading="loading">提交保存</Button>
    <div id="editor" style="margin-top: 5px;height: 600px; width: 100%;">
    </div>
    <pre id="js"></pre>
  </div>
</template>

<script>
import course from '@/api/course'
import Blockly from 'node-blockly/browser'
import locale from 'node-blockly/lib/i18n/zh-hans'
Blockly.setLocale('zh-hans', locale)

Blockly.Blocks['test'] = require('@/blocks/test')
Blockly.Blocks['before_test'] = require('@/blocks/before_test')
Blockly.Blocks['assert_string'] = require('@/blocks/assert_string')
Blockly.Blocks['exec'] = require('@/blocks/exec')

let toolbox = `
<xml id="toolbox" style="display: none">
    <category name="测试" colour="65">
      <block type="test">
        <value name="NAME">
          <shadow type="text"><field name="TEXT">标题</field></shadow>
        </value>
      </block>
      <block type="before_test"></block>
      <block type="assert_string">
        <value name="ACTUAL">
          <shadow type="text"><field name="TEXT">实际值</field></shadow>
        </value>
        <value name="EXPECTED">
          <shadow type="text"><field name="TEXT">期望值</field></shadow>
        </value>
      </block>
      <block type="exec">
        <value name="COMMAND">
          <shadow type="text"><field name="TEXT">node app.js</field></shadow>
        </value>
      </block>
    </category>
    <category name="文件" colour="75"></category>
    <category name="目录" colour="90"></category>
    <category name="网络" colour="115"></category>
    <sep></sep>
    <category name="逻辑" colour="%{BKY_LOGIC_HUE}">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
      <block type="logic_null"></block>
      <block type="logic_ternary"></block>
    </category>
    <category name="循环" colour="%{BKY_LOOPS_HUE}">
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="controls_whileUntil"></block>
      <block type="controls_for">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="BY">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="controls_forEach"></block>
      <block type="controls_flow_statements"></block>
    </category>
    <category name="数学" colour="%{BKY_MATH_HUE}">
      <block type="math_number"></block>
      <block type="math_arithmetic">
        <value name="A">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="math_single">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">9</field>
          </shadow>
        </value>
      </block>
      <block type="math_trig">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">45</field>
          </shadow>
        </value>
      </block>
      <block type="math_constant"></block>
      <block type="math_number_property">
        <value name="NUMBER_TO_CHECK">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <block type="math_round">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">3.1</field>
          </shadow>
        </value>
      </block>
      <block type="math_on_list"></block>
      <block type="math_modulo">
        <value name="DIVIDEND">
          <shadow type="math_number">
            <field name="NUM">64</field>
          </shadow>
        </value>
        <value name="DIVISOR">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="math_constrain">
        <value name="VALUE">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <value name="LOW">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="HIGH">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_int">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_float"></block>
    </category>
    <category name="文本" colour="%{BKY_TEXTS_HUE}">
      <block type="text"></block>
      <block type="text_join"></block>
      <block type="text_append">
        <value name="TEXT">
          <shadow type="text"></shadow>
        </value>
      </block>
      <block type="text_length">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_isEmpty">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT"></field>
          </shadow>
        </value>
      </block>
      <block type="text_indexOf">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">{textVariable}</field>
          </block>
        </value>
        <value name="FIND">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_charAt">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">{textVariable}</field>
          </block>
        </value>
      </block>
      <block type="text_getSubstring">
        <value name="STRING">
          <block type="variables_get">
            <field name="VAR">{textVariable}</field>
          </block>
        </value>
      </block>
      <block type="text_changeCase">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_trim">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_print">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_prompt_ext">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
    </category>
    <category name="列表" colour="%{BKY_LISTS_HUE}">
      <block type="lists_create_with">
        <mutation items="0"></mutation>
      </block>
      <block type="lists_create_with"></block>
      <block type="lists_repeat">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
      </block>
      <block type="lists_length"></block>
      <block type="lists_isEmpty"></block>
      <block type="lists_indexOf">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">{listVariable}</field>
          </block>
        </value>
      </block>
      <block type="lists_getIndex">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">{listVariable}</field>
          </block>
        </value>
      </block>
      <block type="lists_setIndex">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">{listVariable}</field>
          </block>
        </value>
      </block>
      <block type="lists_getSublist">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">{listVariable}</field>
          </block>
        </value>
      </block>
      <block type="lists_split">
        <value name="DELIM">
          <shadow type="text">
            <field name="TEXT">,</field>
          </shadow>
        </value>
      </block>
      <block type="lists_sort"></block>
    </category>
    <category name="颜色" colour="%{BKY_COLOUR_HUE}">
      <block type="colour_picker"></block>
      <block type="colour_random"></block>
      <block type="colour_rgb">
        <value name="RED">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
        <value name="GREEN">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <value name="BLUE">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <block type="colour_blend">
        <value name="COLOUR1">
          <shadow type="colour_picker">
            <field name="COLOUR">#ff0000</field>
          </shadow>
        </value>
        <value name="COLOUR2">
          <shadow type="colour_picker">
            <field name="COLOUR">#3333ff</field>
          </shadow>
        </value>
        <value name="RATIO">
          <shadow type="math_number">
            <field name="NUM">0.5</field>
          </shadow>
        </value>
      </block>
    </category>
    <sep></sep>
    <category name="变量" colour="%{BKY_VARIABLES_HUE}" custom="VARIABLE"></category>
    <category name="过程" colour="%{BKY_PROCEDURES_HUE}" custom="PROCEDURE"></category>
  </xml>
`
export default {
  name: 'section-tests',
  data() {
    return {
      section: {},
      codes: '',
      loading: false
    }
  },
  async mounted() {
    this.section = await course.getSection(this.$route.params.sid)

    let toolbox_xml = Blockly.Xml.textToDom(toolbox)
    let editor = Blockly.inject('editor', {
      toolbox: toolbox_xml
    })

    let codes = await course.getSectionTests(this.section.id)
    if (codes && codes.length) {
      let codesXml = Blockly.Xml.textToDom(codes)
      Blockly.Xml.domToWorkspace(codesXml, editor);
    }

    editor.addChangeListener(() => {
      let xml = Blockly.Xml.workspaceToDom(editor);
      document.getElementById('js').innerText = Blockly.Xml.domToText(xml)
      this.codes = Blockly.Xml.domToText(xml)
    })
  },
  methods: {
    async save() {
      this.loading = true
      try {
        await course.updateSectionTests(this.section.id, this.codes)
        this.$Notice.success({
          title: '保存成功！'
        })
      } catch (err) {
        this.$Notice.fail({
          title: '操作失败',
          desc: err.toString()
        })
      }
      this.loading = false
    }
  },
  components: {
  }
}
</script>

<style scoped>

</style>
