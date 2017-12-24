<template>
    <div class="section-test-docs">
        <h2 class="title">{{section.name}}
            <small>{{section.description}}</small>
        </h2>
        <Button class="save-btn" :loading="loading" type="primary" @click="save">提交保存</Button>

        <Row>
            <Col span="12">
            <codemirror v-model="code" :options="options" width="100%" height="600px" @input="render">
            </codemirror>
            </Col>
            <Col span="12">
            <div class="html-container" v-html="html"></div>
            </Col>
        </Row>
    </div>
</template>

<script>
import codemirror from '@/components/codemirror'
import course from '@/api/course'
import markdown from 'markdown-it'
const md = new markdown()

export default {
    name: 'section-docs',
    data: function() {
        return {
            loading: false,
            code: "",
            html: "",
            options: {
                tabSize: 4,
                theme: 'solarized dark',
                lineNumbers: true,
                mode: 'markdown',
                line: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            },
            section: {}
        }
    },
    methods: {
        render(value) {
            this.html = md.render(value)
        },
        async save() {
            this.loading = true
            try {
                await course.updateSectionDocument(this.section.id, this.code)
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
        codemirror
    },
    async created() {
        this.section = await course.getSection(this.$route.params.sid)
        this.code = await course.getSectionDocument(this.$route.params.sid)
    }
}
</script>

<style>
.section-test-docs h2.title {
    font-weight: 400;
    margin-top: 20px;
    margin-bottom: 10px;
}

.section-test-docs h2 small {
    font-weight: 300;
    margin-left: 30px;
}

.section-test-docs .save-btn {
    margin-bottom: 5px;
}

.section-test-docs .CodeMirror {
    font-size: 18px !important;
}

.html-container {
    margin-left: 5px;
    background-color: lightyellow;
    padding: 15px;
    border: 1px lightgray solid;
    box-shadow: 0px 0px 30px lightgray;
    overflow: scroll;
    height: 600px;
}

</style>