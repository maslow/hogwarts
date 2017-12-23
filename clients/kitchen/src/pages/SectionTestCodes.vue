<template>
    <div class="section-test-codes">
        <h2>{{section.name}}
            <small>{{section.description}}</small>
        </h2>
        <Button class="save-btn" :loading="loading" type="primary" @click="save">提交保存</Button>
        <codemirror v-model="code" :options="options" width="100%" height="600px">
        </codemirror>
    </div>
</template>

<script>
import codemirror from '@/components/codemirror'
import course from '@/api/course'

export default {
    components: {
        codemirror
    },
    name: 'section-test-codes',
    data: function() {
        return {
            section: {},
            loading: false,
            code: '',
            options: {
                tabSize: 4,
                theme: 'solarized dark',
                lineNumbers: true,
                mode: 'javascript',
                line: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            }

        }
    },
    methods: {
        async save() {
            this.loading = true
            try {
                await course.updateSectionTests(this.section.id, this.code)
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
    async created() {
        this.section = await course.getSection(this.$route.params.sid)
        this.code = await course.getSectionTests(this.section.id)
    }
}
</script>

<style>
.section-test-codes h2 {
    font-weight: 400;
    margin-top: 20px;
    margin-bottom: 10px;
}

.section-test-codes h2 small {
    font-weight: 300;
    margin-left: 30px;
}

.section-test-codes .save-btn {
    margin-bottom: 5px;
}
.section-test-codes .CodeMirror{
    font-size: 18px !important;
}
</style>