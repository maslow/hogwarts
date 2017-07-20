<template>
    <Poptip v-model="show" placement="right" width="380" @on-popper-hide="close">
        <slot></slot>
        <div slot="content" class="layout">
            <Slider v-model="value" focus @on-change="ok" show-input></Slider>
            <div style="color:green" v-if="loading">Saving ...</div>    
        </div>
    </Poptip>
</template>

<script>
import course from '@/api/course'

export default {
    props: {
        chapter: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            show: false,
            value: this.chapter.seq,
            loading: false
        }
    },
    methods: {
        async ok() {
            if (this.value === this.chapter.seq) {
                this.$Notice.info({
                    title: '数据无变更',
                    desc: '章节次序未改变，或新旧次序相同'
                })
                return this.show = false
            }
            this.loading = true
            try {
                let data = await course.adjustChapterSeq(this.chapter.id, this.value)
                this.$emit('ok', data)
                this.show = false
                this.$Loading.finish()
                this.$Notice.success({
                    title: '调整章节次序成功!'
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
        }
    }
}
</script>

<style scoped>
.layout {
    padding: 30px 9px 0 9px;
}
</style>
