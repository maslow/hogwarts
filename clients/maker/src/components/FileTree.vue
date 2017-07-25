<template>
    <li>
        <div class="btn btn-link" :class="{bold: model == editing}" @click="toggle">
            <i class="glyphicon glyphicon-folder-open text-yellow" v-if="isFolder && open"></i>
            <i class="glyphicon glyphicon-folder-close text-yellow" v-if="isFolder && !open"></i>
            <i class="glyphicon glyphicon glyphicon-list-alt text-yellow" v-if="!isFolder"></i>
            <span class="text-white" :class="{'text-active':model == editing}">{{model.name}}</span>
            <span class="text-yellow" v-if="isFolder && !emptyFolder">{{open ? '-' : '+'}}</span>
            <span class="text-danger" v-show="!isFolder && model.hash !== model.hash_new">*</span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <file-tree class="item" v-for="model in model.children" :key="model.path" :model="model" :editing="editing" v-on:select="upSelectEvent">
            </file-tree>
        </ul>
    </li>
</template>

<script>
export default {
    name: 'file-tree',
    props: {
        model: Object,
        editing: Object
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

<style>

</style>
