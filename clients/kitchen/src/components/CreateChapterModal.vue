<template>
    <Modal v-model="show" title="新建章" @on-ok="ok" @on-cancel="cancel">
        <Form ref="new-chapter-form" :model="data" :rules="rules" label-position="right" :label-width="80">
            <Form-item label="所属课程" prop="courseName">
                <Input readonly :value="course.name" :placeholder="course.name" style="width: 300px"></Input>
            </Form-item>
            <Form-item label="章节名称" prop="name">
                <Input v-model="data.name"></Input>
            </Form-item>
            <Form-item label="章节简介" prop="description">
                <Input v-model="data.description" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入..."></Input>
            </Form-item>
        </Form>
        <div slot="footer">
            <Button type="success" :loading="loading" @click="ok">提交</Button>
        </div>
    </Modal>
</template>

<script>
import course from '@/api/course'

let rules = {
    name: [
        { required: true, message: '章节名不可为空', trigger: 'blur' },
        { type: 'string', max: 64, message: '章节名不大于64字', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入章节简介', trigger: 'blur' },
        { type: 'string', min: 10, message: '章节简介不少于10字', trigger: 'blur' },
        { type: 'string', max: 255, message: '章节简介不大于255字', trigger: 'blur' }
    ]
}

export default {
    name: 'create-chapter-modal',
    props: {
        value: Boolean,
        course: Object
    },
    data() {
        return {
            data: {
                name: '',
                description: ''
            },
            loading: false,
            rules
        }
    },
    methods: {
        ok() {
            this.$refs['new-chapter-form'].validate(async valid => {
                if (!valid) return;
                this.loading = true
                try {
                    let ch = await course.createChapter(this.course._id, this.data.name, this.data.description)
                    this.$Notice.success({
                        title: '创建章节成功'
                    })
                    this.$emit('ok', ch)
                    this.show = false
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
    }
}
</script>

<style scopded>

</style>
