<template>
    <div>
        <Row>
            <Col :span="12">
            <h2>{{section.name}}</h2>
            <br/>
            <ul>
                <file-tree class="item" v-for="file in files" :key="file.path" :model="file" v-on:select="onSelectFile">
                </file-tree>
            </ul>
            </Col>
            <Col :span="12">
            <codemirror v-model="currentFile.content" :options="options" width="100%" height="600px" @change="onFileContentChange"></codemirror>
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
        this.files = files.map(f => transferFileFormat(f, ''))
    },
    methods: {
        async onSelectFile(file) {
            if (file.type === 'dir') {
                let files = await course.getSectionCodeFiles(this.section.id, file.path, true)
                file.children = files.map(f => transferFileFormat(f, file.path))
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
            this.currentFile.hash_new = md5(this.currentFile.content)
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
                mode: 'js',
                line: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            }
        }
    }
}

function transferFileFormat(file, parent) {
    let path = `${parent}/${file.name}`
    if (file.type === 'dir')
        return {
            path,
            name: file.name,
            type: file.type,
            children: null
        }
    else
        return {
            path,
            name: file.name,
            type: file.type,
            content: null,
            hash: null,
            hash_new: null
        }
}
</script>

<style>

</style>
