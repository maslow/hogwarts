<template>
    <Poptip v-model="show" placement="right" title="删除确认?" width="200" @on-popper-hide="close">
        <slot></slot>
        <div slot="content" class="layout">
            <Button type="ghost" @click="close">取消</Button>
            <Button type="error" @click="ok">确定删除</Button>
            <div style="color:green" v-if="loading">Deleting ...</div>
        </div>
    </Poptip>
</template>

<script>
import course from '@/api/course'

export default {
    name: 'delete-chapter',
    props: {
        chapter: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            show: false,
            loading: false
        }
    },
    methods: {
        async ok() {
            if (this.chapter.sections && this.chapter.sections.length) {
                this.$Notice.error({
                    title: '禁止删除非空章节',
                    desc: '章节内有小节时不允许删除，请先删除该章节内的小节'
                })
                return this.show = false
            }
            this.loading = true
            try {
                let data = await course.deleteChapter(this.chapter._id)
                this.$emit('ok', data)
                this.show = false
                this.$Notice.success({
                    title: '删除章节成功!'
                })
            } catch (err) {
                console.log(err)
                this.$emit('err', err)
                this.$Notice.error({
                    title: '操作失败',
                    desc: err.toString()
                })
            }
            this.loading = false
        },
        close() {
            this.show = false
        }
    }
}
</script>

<style scoped>
.layout {
    padding: 5px;
}
</style>
