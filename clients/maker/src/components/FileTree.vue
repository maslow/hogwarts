<template>
    <li class="file-tree-item">
        <div style="width:100%;">
            <Button type="text" size="small" @click="toggle" class="file-name" :class="{'file-active': editing === model}">
                <Icon type="android-folder-open" class="text-golden" v-if="isFolder && open"></Icon>
                <Icon type="android-folder" class="text-golden" v-if="isFolder && !open"></Icon>
                <Icon type="code" v-if="!isFolder" class="text-info"></Icon>
                <span class="Filename" :class="{'modified': !isFolder && model.hash !== model.hash_new}">{{model.name}}</span>
                <span class="text-yellow" v-show="!isFolder && model.hash !== model.hash_new">*</span>
            </Button>
            <Button type="text" size="small" @click="onDelete">
                <Icon type="ios-close-empty" class="button-delete"></Icon>
            </Button>
        </div>
        <ul v-show="open" v-if="isFolder" class="subtree">
            <file-tree v-for="model in model.children" :key="model.path" :editing="editing" :model="model" v-on:select="upSelectEvent" v-on:delete="upDeleteEvent">
            </file-tree>
        </ul>
    </li>
</template>

<script>
export default {
    name: 'file-tree',
    props: {
        editing: Object,
        model: Object
    },
    data () {
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
        onDelete(){
            this.$emit('delete', this.model)
        },
        upDeleteEvent(model) {
            this.$emit('delete', model)
        },
        upSelectEvent (model) {
            this.$emit('select', model)
        },
        toggle () {
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

.file-active {
    background-color: rgba(13, 121, 187, 0.22);
}

.subtree {
    margin-left: 20px;
}

.Filename {
    color: lightgray;
}

.Filename.modified {
    color: goldenrod;
}

.text-yellow {
    color: yellow
}

.text-danger {
    color: brown
}

.text-golden {
    color: goldenrod
}

.text-info {
    color: #2d8cf0
}

.text-green {
    color: green
}

.button-delete{
    color: rgb(37, 144, 179);
    font-size: 14px;
}

.button-delete:hover{
    color: red;
    font-size: 20px;
}
</style>
