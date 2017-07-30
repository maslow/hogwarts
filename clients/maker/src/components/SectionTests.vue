<template>
    <div class="section-tests">
        <xml id="toolbox" style="display: none">
            <category name="逻辑控制">
                <block type="controls_if"></block>
                <block type="logic_compare"></block>
                <block type="logic_operation"></block>
                <block type="logic_negate"></block>
                <block type="logic_boolean"></block>
            </category>
            <category name="循环控制">
                <block type="controls_repeat_ext">
                    <value name="TIMES">
                        <block type="math_number">
                            <field name="NUM">10</field>
                        </block>
                    </value>
                </block>
                <block type="controls_whileUntil"></block>
            </category>
            <category name="数学操作">
                <block type="math_number"></block>
                <block type="math_arithmetic"></block>
                <block type="math_single"></block>
            </category>
            <category name="文本操作">
                <block type="text"></block>
                <block type="text_length"></block>
                <block type="text_print"></block>
            </category>
        </xml>
    
        <div id="editor" style="height: 480px; width: 100%;">
        </div>
    </div>
</template>

<script>
import course from '@/api/course'
import Blockly from 'node-blockly/browser'

export default {
    name: 'section-tests',
    data() {
        return {
            section: {}
        }
    },
    async mounted() {
        this.section = await course.getSection(this.$route.params.sid)

        let editor = Blockly.inject('editor', {
            toolbox: document.getElementById('toolbox')
        })

        Blockly.Xml.domToWorkspace(code, editor);

        editor.addChangeListener(updateCode);

    },
    methods: {

    },
    components: {

    }
}
</script>

<style>

</style>
