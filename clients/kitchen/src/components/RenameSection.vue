<template>
    <Poptip v-model="show" placement="right" width="380" @on-popper-hide="close">
        <slot></slot>
        <div slot="content">
            <Input v-model="value" :placeholder="section.name" style="width: 300px" @on-focus="copyTo" @on-enter="ok"></Input>
            <Button type="ghost" shape="circle" icon="checkmark-round" :disabled="!value || value === section.name" :loading="loading" @click="ok"></Button>
        </div>
    </Poptip>
</template>

<script>
import course from '@/api/course'

export default {
    props: {
        section: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            value: '',
            loading: false,
            show: false
        }
    },
    methods: {
        copyTo() {
            if (!this.value)
                this.value = this.section.name
        },
        async ok() {
            if (!this.value) {
                return this.$Notice.error({
                    title: '操作失败',
                    desc: '名称不可为空'
                })
            }
            if (this.value === this.section.name) {
                this.$Notice.info({
                    title: '数据无变更',
                    desc: '名称未改变，或新旧名称相同'
                })
                return this.show = false
            }
            this.loading = true

            try {
                let data = await course.renameSection(this.section._id, this.value)
                this.$Notice.success({
                    title: '重命名成功'
                })
                this.$emit('ok', data)
                this.show = false
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
            this.loading = false
            this.value = ''
        }
    }
}
</script>

<style scopded>

</style>
