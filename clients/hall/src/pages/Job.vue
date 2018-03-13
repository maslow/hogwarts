<template>
    <div class="job-page">
        <Row>
            <Col :span="8">
            <div class="document-container">
                <div class="toolbar-above-document">
                  <span style="font-size: 20px;">{{section.name}}</span>
                </div>
                <div class="document-content" v-html="document"></div>
            </div>
            </Col>
            <Col :span="6">
            <div class="file-tree-container">
                <div class="toolbar">
                    <ButtonGroup class="button-group">
                        <Button :disabled="!isLogined()" type="text" size="large" class="text-white" @click="createFileModal = true">
                            <Icon type="plus" color="#ff9900"></Icon>
                            新建文件
                        </Button>
                        <Button :disabled="!isLogined()" type="text" size="large" class="text-white" @click="createFolderModal = true">
                            <Icon type="folder" color="goldenrod"></Icon>
                            新建文件夹
                        </Button>
                        <Button :disabled="!isLogined() || evaluating" type="text" size="large" class="text-white" @click="saveFiles">
                            <Icon type="checkmark" color="#2d8cf0"></Icon>
                            保存
                        </Button>
                    </ButtonGroup>
                </div>
                <ul style="margin-left: 3px">
                    <file-tree v-for="file in files" :editing="currentSelected" :key="file.path" :model="file" v-on:select="onSelectFile" v-on:delete="onDeleteFile">
                    </file-tree>
                </ul>
            </div>
            </Col>
            <Col :span="10">
            <div class="toolbar-above-editor">
                    <Button :disabled="!isLogined()" :loading="evaluating" type="success"  class="text-white" @click="evalJob">
                        <Icon type="ios-play"></Icon>
                        运行
                    </Button>
                </div>
            <codemirror v-model="currentFile.content" :options="options" width="100%" height="560px" @input="onFileContentChange"></codemirror>
            </Col>
        </Row>
        <CreateJobFile v-model="createFileModal" type="file" :selected="currentSelected" @ok="onSelectFile"></CreateJobFile>
        <CreateJobFile v-model="createFolderModal" type="folder" :selected="currentSelected" @ok="onFolderCreated"></CreateJobFile>
        <EvalReportModal v-model="evelReportModal" :reports="reports" />
    </div>
</template>

<script>
import codemirror from "@/components/codemirror";
import Job from "@/api/job";
import Course from "@/api/course";
import FileTree from "@/components/FileTree";
import CreateJobFile from "@/components/CreateJobFile";
import md5 from "blueimp-md5";
import markdown from "markdown-it";
import EvalReportModal from "@/components/EvalReportModal";
import identity from "@/api/identity";

const md = new markdown();

export default {
  name: "job",
  components: {
    codemirror,
    FileTree,
    CreateJobFile,
    EvalReportModal
  },
  data() {
    return {
      job: null,
      section: {},
      reports: null,
      document: "",
      evaluating: false,
      files: [],
      currentFile: {
        content: null,
        name: ""
      },
      currentSelected: {},
      options: {
        tabSize: 4,
        theme: "solarized dark",
        lineNumbers: true,
        lineWrapping: false,
        mode: "js",
        line: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lineSeparator: "\n"
      },
      createFileModal: false,
      createFolderModal: false,
      evelReportModal: false
    };
  },
  async mounted() {
    const sectionId = this.$route.params.sid;
    this.section = await Course.getSection(sectionId);
    this.document = md.render(this.section.document || "");

    if (!this.isLogined()) {
      return this.$Modal.warning({
        title: "请登陆后访问本页面",
        content:
          "抱歉，因本页面功能是编辑和测试用户作业，所以只有登陆用户可正常使用，点击确定即跳往登陆页面。",
        onOk: () => this.$router.push("/login")
      });
    }

    this.job = await Job.getUserJobBySectionId(sectionId);

    let files = await Job.getFiles(this.job._id, "/");
    let parent = {
      type: "dir",
      name: "root",
      path: "",
      children: null
    };
    this.files = files.map(f => transferFileFormat(f, parent));
    parent.children = this.files;
    if (!this.files.length) {
      await this.onSelectFile(parent);
    } else {
      await this.onSelectFile(this.files[0]);
    }
  },
  methods: {
    async onSelectFile(file) {
      if (file.type === "dir") {
        if (!file.children) {
          let files = await Job.getFiles(this.job._id, file.path);
          if (files && files.length)
            file.children = files.map(f => transferFileFormat(f, file));
        }
      } else {
        if (file.content === null) {
          let data = await Job.getFileContent(this.job._id, file.path, true);
          file.content = data.content;
          file.hash = data.hash;
          file.hash_new = data.hash;
        }
        this.currentFile = file;
        this.options.mode = file.name;
      }
      this.currentSelected = file;
    },
    async onFileContentChange(data) {
      this.currentFile.hash_new = md5(data);
    },
    async saveFiles() {
      let files = getChangedFiles(this.files);
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        await Job.updateFileContent(this.job._id, file.path, file.content);
        file.hash = file.hash_new;
      }
      if (files.length) this.$Notice.success({ title: "文件提交保存成功！" });
    },
    async evalJob() {
      this.evaluating = true;
      try {
        await this.saveFiles();
        this.reports = await Job.evalUserJobByJobId(this.job._id);
        this.evelReportModal = true;
        console.log(this.reports);
      } catch (err) {
        this.$Notice.error({ title: "请求失败, 内部错误" });
      }
      this.evaluating = false;
    },
    async onFolderCreated(file) {
      await Job.createFolder(this.job._id, file.path);
      this.$Notice.success({
        title: "创建文件夹成功"
      });
      this.onSelectFile(file);
    },
    async onDeleteFile(file) {
      console.log(file);
      this.$Modal.confirm({
        title: "删除确定",
        content: `<p>删除<span style="color:red"> { ${
          file.path
        } } </span>？</p>`,
        loading: true,
        onOk: async () => {
          await Job.deleteFile(this.job._id, file.path);
          this.$Notice.success({
            title: "文件已删除！"
          });
          let p = file.parent;
          for (let i = 0; i < p.children.length; i++) {
            let f = p.children[i];
            if (f.name === file.name) {
              console.log(file.name);
              p.children.splice(i, 1);
              break;
            }
          }
          this.onSelectFile(p);
          this.$Modal.remove();
        }
      });
    },
    isLogined() {
      return !identity.isExpired();
    }
  }
};

function getChangedFiles(files) {
  let changedFiles = files.filter(f => f.hash !== f.hash_new);
  let dirs = files.filter(f => f.type === "dir" && f.children !== null);
  let subfiles = [];
  dirs.forEach(dir => {
    let arr = getChangedFiles(dir.children);
    subfiles = subfiles.concat(arr);
  });
  return subfiles.concat(changedFiles);
}

function transferFileFormat(file, parent) {
  let path = `${parent.path}/${file.name}`;
  if (file.type === "dir")
    return {
      path,
      name: file.name,
      type: file.type,
      children: null,
      parent
    };
  else
    return {
      path,
      name: file.name,
      type: file.type,
      content: null,
      hash: null,
      hash_new: null,
      parent
    };
}
</script>

<style>
h1,
h2 {
  font-weight: normal;
}

.job-page {
  padding-top: 0px;
}

.CodeMirror {
  font-size: 15px !important;
}

.text-white {
  color: whitesmoke;
}

.file-tree-container {
  background-color: rgb(11, 76, 97);
  height: 600px;
  overflow: auto;
}

.file-tree-container .toolbar {
  padding: 2px 1px 1px;
  margin-bottom: 5px;
  border-bottom: 1px solid rgb(11, 61, 78);
  box-shadow: 1px 6px 30px rgba(11, 61, 78, 0.997);
  background-color: rgb(8, 51, 66);
  text-align: right;
}

.toolbar-above-editor {
  padding: 3px 10px 2px 30px;
  border-bottom: 1px solid rgb(11, 61, 78);
  box-shadow: 1px 6px 30px rgba(11, 61, 78, 0.997);
  background-color: rgb(8, 51, 66);
  text-align: left;
  border-left: 1px solid rgb(8, 51, 66);
}

.document-container {
  background-color: lightyellow;
  border: 0px solid rgb(211, 211, 211);
  height: 600px;
}

.document-container .document-content {
  padding: 15px;
  height: 560px;
  overflow: scroll;
}

.document-container .toolbar-above-document {
  height: 40px;
  padding: 4px 5px 4px 12px;
  border: 1px solid lightgray;
  box-shadow: 0px 1px 10px rgba(211, 211, 211, 0.555);
  /* background-color: rgb(8, 51, 66); */
  background-color: #c6daef0d;
  text-align: left;
}

.document-container blockquote {
  padding: 10px;
}

.document-container pre {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.42857143;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.document-container pre code {
  padding: 0;
  font-size: inherit;
  color: inherit;
  white-space: pre-wrap;
  background-color: transparent;
  border-radius: 0;
}
</style>
