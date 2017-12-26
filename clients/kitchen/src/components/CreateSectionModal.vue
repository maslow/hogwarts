<template>
    <Modal v-model="show" title="新建小节" @on-ok="ok" @on-cancel="cancel">
        <Form ref="new-section-form" :model="data" :rules="rules" label-position="right" :label-width="100">
            <Form-item label="所属课程">
                <Input readonly :value="course.name"></Input>
            </Form-item>
            <Form-item label="所属章" prop="chapter">
                <Select v-model="data.chapter" filterable>
                    <Option v-for="ch in chapters" :value="ch._id" :key="ch._id">{{ ch.name }}</Option>
                </Select>
            </Form-item>
            <Form-item label="名称" prop="name">
                <Input v-model="data.name"></Input>
            </Form-item>
            <Form-item label="简介" prop="description">
                <Input v-model="data.description" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入..."></Input>
            </Form-item>
            <Form-item label="初始代码模板" prop="template">
                <Select v-model="data.template" filterable clearable>
                    <Option v-for="tpl in templates" :value="tpl._id" :key="tpl._id">{{ tpl.name }}</Option>
                </Select>
            </Form-item>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="cancel">取消</Button>
            <Button type="success" :loading="loading" @click="ok">提交</Button>
        </div>
    </Modal>
</template>

<script>
import course from '@/api/course'

const rules = {
    name: [
        { required: true, message: '小节名不可为空', trigger: 'blur' },
        { type: 'string', max: 64, message: '小节名不大于64字', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入小节简介', trigger: 'blur' },
        { type: 'string', min: 10, message: '简介不少于10字', trigger: 'blur' },
        { type: 'string', max: 255, message: '简介不大于255字', trigger: 'blur' }
    ],
    chapter: [
        { type: 'string', required: true, message: '所属章节必选', trigger: 'change' }
    ],
    template: [
        { type:'string', required:true, message: '请选择一个代码模板', trigger:'change'}
    ]
}

export default {
    name: 'create-section-modal',
    props: {
        value: Boolean,
        course: {
            type: Object,
            required: true
        },
        chapters: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            templates: [],
            data: {
                chapter: '',
                name: '',
                description: '',
                template: null
            },
            loading: false,
            rules
        }
    },
    methods: {
        ok() {
            this.$refs['new-section-form'].validate(async valid => {
                if (!valid) return;
                this.loading = true
                try {
                    let ch = await course.createSection(this.course._id, this.data.chapter, this.data.template, this.data.name, this.data.description, this.data.image)
                    this.$Notice.success({
                        title: '创建小节成功'
                    })
                    this.$emit('ok', ch)
                    this.show = false
                    this.$refs['new-section-form'].resetFields()
                } catch (err) {
                    console.log(err)
                    this.$Notice.error({
                        title: '操作失败',
                        desc: err.toString()
                    })
                    this.$emit('err', this.data)
                }
                this.loading = false
            })

        },
        cancel() {
            this.loading = false
            this.show = false
            this.$refs['new-section-form'].resetFields()
        }
    },
    computed: {
        show: {
            get: function () {
                return this.value
            },
            set: function (value) {
                this.$emit('input', value)
            }
        }
    },
    async created() {
        this.templates = await course.getTemplates()
    }
}
</script>

<style scopded>

</style>
