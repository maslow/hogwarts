<template>
    <Modal v-model="_show" title="更新课程简介" @on-cancel="cancel">
        <Form :label-width="80">
            <Form-item label="原简介">
                <Input readonly type="textarea" :value="course.description" :autosize="{minRows: 4,maxRows: 6}"></Input>
            </Form-item>
            <Form-item label="新简介">
                <Input v-model="value" type="textarea" :placeholder="course.description" :autosize="{minRows: 4,maxRows: 6}" @on-focus="copyTo"></Input>
            </Form-item>
        </Form>
        <div slot="footer">
            <Button type="success" :loading="loading" @click="ok">提交</Button>
        </div>
    </Modal>
</template>

<script>
import course from '@/api/course'

export default {
    model: {
        prop: 'show',
        event: 'close'
    },
    props: {
        show: Boolean,
        course: Object
    },
    data() {
        return {
            value: '',
            loading: false
        }
    },
    methods: {
        async ok() {
            if (!this.value)
                return this.$Notice.error({
                    title: '验证失败',
                    desc: "课程简介不可为空"
                })

            if (this.value === this.course.description) {
                this.$Notice.info({
                    title: '数据无更变',
                    desc: '你没有更改课程简介内容，或新旧内容相同'
                })
                return this.$emit('close', false)
            }
            this.loading = true
            try {
                await course.updateCourseDescription(this.course.id, this.value)
                this.$Notice.success({
                    title: '更新课程简介成功'
                })
                this.$emit('ok', this.value)
                this.$emit('close', false)
                this.value = ''
            } catch (err) {
                console.log(err)
                this.$Notice.error({
                    title: '操作失败',
                    desc: err.toString()
                })
                this.$emit('err', this.value)
            }

            this.loading = false
        },
        cancel() {
            this.$emit('close', false)
            this.loading = false
            this.value = ''
        },
        copyTo() {
            if (!this.value)
                this.value = this.course.description
        }
    },
    computed: {
        _show() {
            return this.show
        }
    }
}
</script>

<style>

</style>
