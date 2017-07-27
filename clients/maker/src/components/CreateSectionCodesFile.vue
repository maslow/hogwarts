<template>
    <Modal v-model="show" :title="title">
        新建{{type === 'dir' ? '文件夹': '文件'}}：
        <Input v-model="name" :autofocus="true" @on-enter="submit"></Input>
        <div slot="footer">
            <Button type="success" :loading="loading" @click="submit">确定</Button>
        </div>
    </Modal>
</template>

<script>
import md5 from 'blueimp-md5'

export default {
    props: {
        value: Boolean,
        selected: Object,
        type: String,
    },
    data() {
        return {
            loading: false,
            name: ''
        }
    },
    methods: {
        submit() {
            if (!this.name) return;
            let p = this.selected
            if (p.type !== 'dir')
                p = p.parent

            const reg = /^[^#%&*\/|:<>?\"]*$/
            if (!reg.test(this.name))
                return this.$Notice.error({
                    title: '文件名有非法字符'
                })

            if (p.children.filter(c => c.name === this.name).length)
                return this.$Notice.error({
                    title: '文件名已存在'
                })

            let file = {}
            if (this.type === 'folder') {
                file = {
                    path: `${p.path}/${this.name}`,
                    name: this.name,
                    type: 'dir',
                    children: null,
                    parent: p
                }
            } else {
                file = {
                    path: `${p.path}/${this.name}`,
                    name: this.name,
                    type: 'file',
                    content: '',
                    hash: '',
                    hash_new: null,
                    parent: p
                }
            }
            this.show = false
            this.name = ''
            p.children.push(file)
            this.$emit('ok', file)
        }
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit('input', value)
            }
        },
        title: {
            get() {
                return this.type === 'dir' ? '新建文件夹' : '新建文件'
            }
        }
    }
}
</script>

<style>

</style>
