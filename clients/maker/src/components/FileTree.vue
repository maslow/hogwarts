<template>
    <li class="file-tree-item">
        <Button type="text" size="small" @click="toggle" class="file-name">
            <Icon type="android-folder-open" class="text-golden" v-if="isFolder && open"></Icon>
            <Icon type="android-folder" class="text-golden" v-if="isFolder && !open"></Icon>
            <Icon type="code" v-if="!isFolder" class="text-info"></Icon>
            <span class="text-white">{{model.name}}</span>
            <span class="text-yellow" v-if="isFolder && !emptyFolder">{{open ? '-' : '+'}}</span>
            <span class="text-danger" v-show="!isFolder && model.hash !== model.hash_new">*</span>
        </Button>
        <ul v-show="open" v-if="isFolder" class="subtree">
            <file-tree v-for="model in model.children" :key="model.path" :model="model" v-on:select="upSelectEvent">
            </file-tree>
        </ul>
    </li>
</template>

<script>
export default {
    name: 'file-tree',
    props: {
        model: Object
    },
    data: function () {
        return {
            open: false
        }
    },
    computed: {
        isFolder: function () {
            return this.model.type === 'dir'
        },
        emptyFolder: function () {
            return this.model.type === 'dir' && !this.model.children
        }
    },
    methods: {
        upSelectEvent: function (model) {
            this.$emit('select', model)
        },
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
            this.$emit('select', this.model)
        }
    }
}
</script>

<style scoped>
.file-tree-item {
    font-size: 18px !important;
}

.file-name {
    font-size: 16px;
}

.subtree {
    margin-left: 20px;
}

.text-white {
    color: lightgray;
}
.text-yellow{
    color: yellow
}
.text-danger{
    color: brown
}
.text-golden{
    color: goldenrod
}
.text-info{
    color: #2d8cf0
}
</style>
