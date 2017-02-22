function initPage() {
    ace.require("ace/ext/language_tools")
    var modelist = ace.require("ace/ext/modelist")
    var md = window.markdownit()
    new Vue({
        el: '#wrapper',
        data: {
            files: [],
            editingCode: {},
            editor: null,
            reports: '',
            testingStatus: false,
            savingStatus: false,
            course: {},
            chapter: {},
            section: {},
            job: {},
            text: "",
            nextSection: {},
            prevSection: {},
            showText: true,
            windowHeight: 700
        },
        methods: {
            onSelectFile: function (file) {
                var t = this
                if (file.type === 'dir' && !file.children) {
                    api.getFiles(t.job.id, file.id)
                        .success(function (data) {
                            file.children = data.files.map(formatFileObject)
                        })
                } else {
                    this.setCurrentFile(file)
                }
            },
            setCurrentFile: function (code) {
                var t = this
                if (code.type === 'dir') return;
                if (code == this.editingCode) return;
                if (code.content === null) {
                    api.getFile(this.job.id, code.id)
                        .success(function (data) {
                            code.content = data.content
                            code.hash = data.hash
                            code.hash_new = data.hash
                            t.editingCode = code;
                            var mode = modelist.getModeForPath(code.name).mode
                            t.editor.session.setMode(mode);
                            t.editor.setValue(code.content)
                            t.editor.gotoLine(1)
                        })
                } else {
                    this.editingCode = code;
                    var mode = modelist.getModeForPath(code.name).mode
                    this.editor.session.setMode(mode);
                    this.editor.setValue(code.content)
                    this.editor.gotoLine(1)
                }
            },
            saveFiles: function (callback) {
                var t = this
                if (t.savingStatus) return;
                t.savingStatus = true
                var files = getChangedFiles(t.files)
                if (!files.length) {
                    t.savingStatus = false
                    return callback && callback(null);
                }
                api.saveFiles(t.job.id, files)
                    .then(function () {
                        if (arguments.length)
                            for (var i = 0; i < files.length; i++)
                                files[i].hash = files[i].hash_new
                        t.savingStatus = false
                        callback && callback(null)
                    })
                    .fail(function (err) {
                        swal('网络出错了,请重试')
                        t.savingStatus = false
                        callback && callback(err)
                    })

            },
            run: function () {
                var t = this
                if (t.testingStatus) return;
                t.testingStatus = true
                t.saveFiles(function (err) {
                    if (err) return;
                    api.eval(t.job.id)
                        .success(function (reports) {
                            t.testingStatus = false
                            t.reports = reports
                            t.report(reports)
                        }).error(function () {
                            t.testingStatus = false
                        })
                })

            },
            report: function (data) {
                var t = this
                var text = "<hr>"
                text += _.map(data.tests, function (t) {
                    if (t.passed)
                        return "<div class='report-success'><span>" + t.title +
                            "</span><p>OK</p></div>"
                    else
                        return "<div class='report-err'><span>" + t.title + "</span><p>" +
                            _.replace(t.err.message, '\n', '<br>') + "</p></div>"
                }).join('')
                text += "<hr>"
                if (data.ok) {
                    swal({
                        title: "pass!",
                        text: text,
                        type: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: t.nextSection ? "进入下一节" : "没有了",
                        closeOnConfirm: false,
                        html: true
                    }, function () {
                        if (t.nextSection)
                            location.href = "section.html?s=" + t.nextSection.id + '&c=' +
                            t.nextSection.courseId + '&ch=' + t.nextSection.chapterId
                    })
                } else {
                    swal({
                        title: "~fail~",
                        type: "info",
                        text: text,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        html: true
                    })
                }
            },
            resize: function () {
                var height = window.innerHeight
                this.windowHeight = height - 60
                this.editor.setOption("maxLines", this.windowHeight/18.6 -1)
            }
        },
        mounted: function () {
            var t = this            
            window.onresize = t.resize
            t.editor = initEditor()
            t.editor.getSession().on('change', function (action, session) {
                if (t.editingCode) {
                    t.editingCode.content = session.getValue()
                    t.editingCode.hash_new = md5(t.editingCode.content)
                }
            })
            t.resize()
            var sectionName = $.getUrlParam('s')
            var courseName = $.getUrlParam('c')
            var chapterName = $.getUrlParam('ch')

            api.getCourse(courseName)
                .success(function (data) {
                    t.chapter = _.filter(data.chapters, function (chapter) {
                        return chapter.id === chapterName
                    }).shift()
                    t.course = data.course
                })
            api.getSection(courseName, chapterName, sectionName)
                .success(function (data) {
                    t.section = data.section
                    t.text = md.render(data.text)
                })
            api.getJob(courseName, chapterName, sectionName)
                .success(function (data) {
                    var files = data.files
                    t.job = data.job
                    t.files = _.map(files, formatFileObject)
                    var file = _.first(t.files.filter(function (f) {
                        return f.type === 'file'
                    }))
                    if (!file) return;
                    t.setCurrentFile(file)
                })
            api.getNextSection(courseName, chapterName, sectionName)
                .success(function (data) {
                    t.nextSection = data
                })
        }
    })
}

function initEditor() {
    var editor = ace.edit("editor")
    editor.setTheme("ace/theme/twilight")
    editor.setFontSize('14px')
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false,
    })
    editor.setAutoScrollEditorIntoView(true)
    return editor
}

function getChangedFiles(files) {
    var changedFiles = files.filter(function (f) {
        return f.hash !== f.hash_new
    })
    var dirs = files.filter(function (f) {
        return f.type === 'dir' && f.children !== null
    })
    var subfiles = []
    dirs.forEach(function (dir) {
        var arr = getChangedFiles(dir.children)
        subfiles = subfiles.concat(arr)
    })
    return subfiles.concat(changedFiles)
}

function formatFileObject(f) {
    if (f.type === 'dir')
        return {
            id: f.id,
            name: f.name,
            type: f.type,
            children: null
        }
    else
        return {
            id: f.id,
            name: f.name,
            type: f.type,
            content: null,
            hash: null,
            hash_new: null
        }
}