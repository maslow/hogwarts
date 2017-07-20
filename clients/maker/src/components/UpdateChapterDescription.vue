<template>
    <Poptip v-model="show" placement="right-start" width="450" @on-popper-hide="close">
        <slot></slot>
        <div slot="content">
            <Input v-model="value" type="textarea" style="width:400px;" :placeholder="chapter.description" :autosize="{minRows: 4,maxRows: 6}" @on-focus="copyTo">
            </Input>
            <div class="layout-button-save">
                <Button type="ghost" icon="checkmark-round" :loading="loading" @click="ok">保存</Button>
            </div>
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
            value: '',
            loading: false,
            show: false
        }
    },
    methods: {
        copyTo() {
            if (!this.value)
                this.value = this.chapter.description
        },
        async ok() {
            if (!this.value) {
                return this.$Notice.error({
                    title: '操作失败',
                    desc: '章节简介不可为空'
                })
            }
            if (this.value === this.chapter.description) {
                this.$Notice.info({
                    title: '数据无变更',
                    desc: '章节简介未改变，或新旧简介相同'
                })
                return this.show = false
            }
            this.loading = true

            try {
                let data = await course.updateChapterDescription(this.chapter.id, this.value)
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
.layout-button-save {
    margin-top: 5px;
    text-align: right;
    padding-right: 5px;
}
</style>
