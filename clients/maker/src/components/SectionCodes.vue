<template>
    <div>
        <Row>
            <Col :span="4">
            <h2>{{section.name}}</h2>
            <Button type="success" @click="saveFiles">提交保存</Button>
            </Col>
            <Col :span="4">
            <div style="background-color:rgb(11, 76, 97);height:600px;">
                <div class="toolbar">
                    <ButtonGroup class="button-group">
                        <Button type="text" size="small" class="text-white" @click="createFile">
                            <Icon type="ios-plus-empty"></Icon>
                            新建文件
                        </Button>
                        <Button type="text" size="small" class="text-white" @click="createFolder">
                            <Icon type="folder"></Icon>
                            新建文件夹
                        </Button>
                    </ButtonGroup>
                </div>
                <ul style="margin-left: 3px">
                    <file-tree v-for="file in files" :editing="currentFile" :key="file.path" :model="file" v-on:select="onSelectFile">
                    </file-tree>
                </ul>
            </div>
            </Col>
            <Col :span="16">
            <codemirror v-model="currentFile.content" :options="options" width="100%" height="600px" @input="onFileContentChange"></codemirror>
            </Col>
        </Row>
    </div>
</template>

<script>
import codemirror from './codemirror'
import course from '@/api/course'
import FileTree from './FileTree'
const md5 = require('blueimp-md5')

export default {
    name: 'section-codes',
    components: {
        codemirror,
        FileTree
    },
    async mounted() {
        this.section = await course.getSection(this.$route.params.sid)
        let files = await course.getSectionCodeFiles(this.$route.params.sid, '/', true)
        let parent = {
            type: 'dir',
            name: 'root',
            path: '',
            children: null
        }
        this.files = files.map(f => transferFileFormat(f, parent))
        parent.children = this.files
        for (let i = 0; i < this.files.length; i++)
            if (this.files[i].type === 'file') {
                this.onSelectFile(this.files[i])
                break
            }
    },
    methods: {
        async onSelectFile(file) {
            if (file.type === 'dir') {
                if (!file.children) {
                    let files = await course.getSectionCodeFiles(this.section.id, file.path, true)
                    file.children = files.map(f => transferFileFormat(f, file))
                }
            } else {
                if (file.content === null) {
                    let data = await course.getSectionCodeFileContent(this.section.id, file.path, true)
                    file.content = data.content
                    file.hash = data.hash
                }
                this.currentFile = file
                this.options.mode = file.name
            }
        },
        async onFileContentChange(data) {
            this.currentFile.hash_new = md5(data)
        },
        async saveFiles() {
            let files = getChangedFiles(this.files)
            console.log(files)
        },
        async createFile() {
            let name = prompt('请输入文件名')
            if (!name)
                return;
            let p = this.currentFile.parent
            let ret = p.children.filter(c => c.name === name)
            const reg = /^[^#%&*\/|:<>?\"]*$/
            if (!reg.test(name))
                return console.log("名字有问题，再来")

            if (ret.length)
                return console.log('有问题，名字存在了，重来吧')

            p.children.push({
                path: `${p.path}/${name}`,
                name,
                type: 'file',
                content: null,
                hash: md5(''),
                hash_new: null,
                parent: p
            })
        },
        async createFolder() {
            let name = prompt('请输入文件夹名')
            if (!name)
                return;
            let p = this.currentFile.parent
            let ret = p.children.filter(c => c.name === name)
            const reg = /^[^#%&*\/|:<>?\"]*$/
            if (!reg.test(name))
                return console.log("名字有问题，再来")

            if (ret.length)
                return console.log('有问题，名字存在了，重来吧')

            p.children.push({
                path: `${p.path}/${name}`,
                name,
                type: 'dir',
                children: null,
                parent: p
            })
        }
    },
    data() {
        return {
            section: {},
            files: [],
            currentFile: {
                content: null,
                name: '',
            },
            options: {
                tabSize: 4,
                theme: 'solarized dark',
                lineNumbers: true,
                lineWrapping: true,
                mode: 'js',
                line: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                lineSeparator: "\n"
            }
        }
    }
}

function getChangedFiles(files) {
    let changedFiles = files.filter(f => f.hash !== f.hash_new)
    let dirs = files.filter(f => f.type === 'dir' && f.children !== null)
    let subfiles = []
    dirs.forEach(dir => {
        let arr = getChangedFiles(dir.children)
        subfiles = subfiles.concat(arr)
    })
    return subfiles.concat(changedFiles)
}

function transferFileFormat(file, parent) {
    let path = `${parent.path}/${file.name}`
    if (file.type === 'dir')
        return {
            path,
            name: file.name,
            type: file.type,
            children: null,
            parent
        }
    else
        return {
            path,
            name: file.name,
            type: file.type,
            content: null,
            hash: null,
            hash_new: null,
            parent
        }
}
</script>

<style>
h1,
h2 {
    font-weight: normal;
}

.CodeMirror {
    font-size: 15px !important;
}

.text-white {
    color: whitesmoke;
}

.toolbar {
    padding: 3px;
    margin-bottom: 5px;
    border-bottom: 1px solid rgba(211, 211, 211, 0.23);
    background-color: rgba(8, 55, 70, 0.79);
    text-align: right;
}
</style>
