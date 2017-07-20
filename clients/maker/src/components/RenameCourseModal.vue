<template>
    <Modal v-model="show" title="重命名课程" @on-cancel="cancel">
        原名称：
        <Input readonly :value="course.name" :placeholder="course.name" style="width: 300px"></Input>
        <br/>
        <br/> 新名称：
        <Input v-model="value" :placeholder="course.name" style="width: 300px" @on-focus="copyTo"></Input>
        <div slot="footer">
            <Button type="success" :loading="loading" @click="ok">提交</Button>
        </div>
    </Modal>
</template>

<script>
import course from '@/api/course'

export default {
    model: {
        prop: '_show',
        event: 'close'
    },
    props: {
        _show: Boolean,
        course: Object
    },
    data() {
        return {
            value: null,
            loading: false
        }
    },
    methods: {
        async ok() {
            if (!this.value) {
                this.$Notice.error({
                    title: '验证失败',
                    desc: "名称不可为空"
                })
                return;
            }
            if (this.value === this.course.name) {
                this.$Notice.info({
                    title: '名称无更变',
                    desc: '你没有更改课程名,或新旧课程名相同'
                })
                return this.$emit('close', false)
            }
            this.loading = true
            try {
                await course.renameCourse(this.course.id, this.value)
                this.$Notice.success({
                    title: '重命名课程成功'
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
                this.value = this.course.name
        }
    },
    computed: {
        show() {
            return this._show
        }
    }
}
</script>

<style scopded>

</style>
