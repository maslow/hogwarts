<template>
    <Poptip v-model="show" placement="right" width="380" @on-popper-hide="close">
        <slot></slot>
        <div slot="content" class="layout">
            <Slider v-model="value" @on-change="ok" show-input></Slider>
            <div style="color:green" v-if="loading">Saving ...</div>    
        </div>
    </Poptip>
</template>

<script>
import course from '@/api/course'

export default {
    name: 'adjust-section-seq',
    props: {
        section: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            show: false,
            value: this.section.seq,
            loading: false
        }
    },
    methods: {
        async ok() {
            if (this.value === this.section.seq) {
                this.$Notice.info({
                    title: '数据无变更',
                    desc: '章节次序未改变，或新旧次序相同'
                })
                return this.show = false
            }
            this.loading = true
            try {
                let data = await course.adjustSectionSeq(this.section.id, this.value)
                this.$emit('ok', data)
                this.show = false
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
