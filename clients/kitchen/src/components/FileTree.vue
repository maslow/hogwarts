<template>
    <li class="file-tree-item">
        <Button class="file-name" long type="text" size="small" @click="toggle" :class="{'file-active': editing === model}">
            <Icon type="android-folder-open" class="text-golden" v-if="isFolder && open"></Icon>
            <Icon type="android-folder" class="text-golden" v-if="isFolder && !open"></Icon>
            <Icon type="code" v-if="!isFolder" class="text-info"></Icon>
            <span class="Filename" :class="{'modified': !isFolder && model.hash !== model.hash_new}">{{model.name}}</span>
            <span class="text-white" v-show="!isFolder && model.hash !== model.hash_new">*</span>
            <span @click="onDelete">
                <Icon type="ios-close-empty" class="button-delete"></Icon>
            </span>
        </Button>
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
    data() {
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
        onDelete() {
            this.$emit('delete', this.model)
        },
        upDeleteEvent(model) {
            this.$emit('delete', model)
        },
        upSelectEvent(model) {
            this.$emit('select', model)
        },
        toggle() {
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
    white-space: nowrap;
    text-align: left;
}

.file-name:hover .Filename {
    color: lightgreen;
}

.file-name .Filename {
    color: lightgray;
}

.file-name .Filename.modified {
    color: goldenrod;
}

.file-active {
    background-color: rgba(13, 121, 187, 0.22);
}

.subtree {
    margin-left: 20px;
}

.text-golden {
    color: goldenrod
}

.text-info {
    color: #2d8cf0
}

.button-delete {
    margin-left: 2px;
    color: rgb(37, 144, 179);
    font-size: 14px;
}

.button-delete:hover {
    color: lightcoral;
    font-size: 18px;
}
</style>
