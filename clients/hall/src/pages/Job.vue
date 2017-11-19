<template>
    <div>
        <Row>
            <Col :span="6">
            <div style="background-color:rgb(11, 76, 97);height:600px;overflow: auto; ">
                <div class="toolbar">
                    <ButtonGroup class="button-group">
                        <Button type="text" size="small" class="text-white" @click="saveFiles">
                            <Icon type="checkmark"></Icon>
                            提交保存
                        </Button>
                        <Button type="text" size="small" class="text-white" @click="createFileModal = true">
                            <Icon type="ios-plus-empty"></Icon>
                            新建文件
                        </Button>
                        <Button type="text" size="small" class="text-white" @click="createFolderModal = true">
                            <Icon type="folder"></Icon>
                            新建文件夹
                        </Button>
                    </ButtonGroup>
                </div>
                <ul style="margin-left: 3px">
                    <file-tree v-for="file in files" :editing="currentSelected" :key="file.path" :model="file" v-on:select="onSelectFile" v-on:delete="onDeleteFile">
                    </file-tree>
                </ul>
            </div>
            </Col>
            <Col :span="18">
            <codemirror v-model="currentFile.content" :options="options" width="100%" height="600px" @input="onFileContentChange"></codemirror>
            </Col>
        </Row>
        <!-- <CreateSectionCodesFile v-model="createFileModal" type="file" :selected="currentSelected" @ok="onSelectFile"></CreateSectionCodesFile>
        <CreateSectionCodesFile v-model="createFolderModal" type="folder" :selected="currentSelected" @ok="onFolderCreated"></CreateSectionCodesFile> -->
    </div>
</template>

<script>
import codemirror from '@/components/codemirror'
import course from '@/api/course'
import Job from '@/api/job'
import FileTree from '@/components/FileTree'
// import CreateSectionCodesFile from '@/components/CreateSectionCodesFile'
import md5 from 'blueimp-md5'

export default {
    name: 'job',
    components: {
        codemirror,
        FileTree,
        //CreateSectionCodesFile
    },
    data() {
        return {
            section: {},
            files: [],
            currentFile: {
                content: null,
                name: '',
            },
            currentSelected: {},
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
            },
            createFileModal: false,
            createFolderModal: false
        }
    },
    async mounted() {
        this.section = await course.getSection(this.$route.params.sid)        
        this.job = await Job.getUserJobBySectionId(this.$route.params.sid)
        let files = await Job.getFiles(this.job.id, '/')
        let parent = {
            type: 'dir',
            name: 'root',
            path: '',
            children: null
        }
        this.files = files.map(f => transferFileFormat(f, parent))
        parent.children = this.files
        if (!this.files.length)
            this.onSelectFile(parent)
        else
            this.onSelectFile(this.files[0])
    },
    methods: {
        async onSelectFile(file) {
            if (file.type === 'dir') {
                if (!file.children) {
                    let files = await Job.getFiles(this.job.id, file.path)
                    file.children = files.map(f => transferFileFormat(f, file))
                }
            } else {
                if (file.content === null) {
                    let data = await Job.getFileContent(this.job.id, file.path, true)
                    file.content = data.content
                    file.hash = data.hash
                    file.hash_new = data.hash
                }
                this.currentFile = file
                this.options.mode = file.name
            }
            this.currentSelected = file
        },
        async onFileContentChange(data) {
            this.currentFile.hash_new = md5(data)
        },
        async saveFiles() {
            let files = getChangedFiles(this.files)
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                await course.updateSectionCodeFileContent(this.section.id, file.path, file.content)
                file.hash = file.hash_new
            }
            this.$Notice.success({
                title: '文件提交保存成功！'
            })
        },
        async onFolderCreated(file) {
            await course.createSectionCodeFolder(this.section.id, file.path)
            this.$Notice.success({
                title: '创建文件夹成功'
            })
            this.onSelectFile(file)
        },
        async onDeleteFile(file) {
            this.$Modal.confirm({
                title: '删除确定',
                content: `<p>删除<span style="color:red"> { ${file.path} } </span>？</p>`,
                loading: true,
                onOk: async () => {
                    //let file = this.currentSelected
                    await course.deleteCodeFile(this.section.id, file.path)
                    this.$Notice.success({
                        title: '文件已删除！'
                    })
                    let p = file.parent
                    for (let i = 0; i < p.children.length; i++) {
                        let f = p.children[i]
                        if (f.name === file.name) {
                            console.log(file.name)
                            p.children.splice(i, 1)
                            break;
                        }
                    }
                    this.onSelectFile(p)
                    this.$Modal.remove()
                }
            })
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
