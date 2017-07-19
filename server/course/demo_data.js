/**
 * Created by wangfugen on 7/28/16.
 */

let mysql = require("mysql")
let path = require("path")
let fs = require("fs-extra")
let config = fs.readJsonSync(path.join(__dirname, 'db.json'))

let connection = mysql.createConnection({
    host: config.host || "localhost",
    port: config.port || 3306,
    user: config.user,
    password: config.passwd
})

connection.connect()

let Query = function (sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results, fields) {
            if (error) return reject(error)
            return resolve(results)
        })
    })
}

let sqls = `
INSERT INTO tech_course.course (name, description, status, created_by, created_at, updated_at) VALUES ('PHP从入门到放弃', 'PHP（Hypertext Preprocessor）是一种通用开源脚本语言。语法吸收了C语言、Java和Perl的特点，利于学习，使用广泛，主要适用于Web开发领域。PHP 独特的语法混合了C、Java、Perl以及PHP自创的语法。它可以比CGI或者Perl更快速地执行动态网页。', 0, 1, 1500116242, 1500116242);
INSERT INTO tech_course.course (name, description, status, created_by, created_at, updated_at) VALUES ('Nodejs从放弃到入门', 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 
Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。 
Node.js 的包管理器 npm，是全球最大的开源库生态系统。', 1, 1, 1500118131, 1500118131);
INSERT INTO tech_course.course (name, description, status, created_by, created_at, updated_at) VALUES ('Java从精通到入门', 'Java是一门面向对象编程语言，不仅吸收了C++语言的各种优点，还摒弃了C++里难以理解的多继承、指针等概念，因此Java语言具有功能强大和简单易用两个特征。', 0, 1, 1500118345, 1500118345);
INSERT INTO tech_course.chapter (course_id, name, description, seq, created_at, updated_at) VALUES (2, '第一章 起手式', '初生牛犊不怕虎', 0, 0, 0);
INSERT INTO tech_course.chapter (course_id, name, description, seq, created_at, updated_at) VALUES (2, '第二章 文件操作篇', '管道啊管道，从此Windows是路人！', 0, 0, 0);
INSERT INTO tech_course.chapter (course_id, name, description, seq, created_at, updated_at) VALUES (2, '第三章 网络编程', '大家好才是真的好!', 0, 0, 0);
INSERT INTO tech_course.section (course_id, chapter_id, template_id, name, description, seq, status, env, created_by, created_at, updated_at) VALUES (2, 1, 1, '第1节 你好，Node', '起手式，打开新世界', 0, 0, '{"image": "node:7-alpine"}', 1, 0, 0);
INSERT INTO tech_course.section (course_id, chapter_id, template_id, name, description, seq, status, env, created_by, created_at, updated_at) VALUES (2, 1, 1, '第2节 命令行参数', '耐心点，再耐心一点', 0, 0, '{"image": "node:7-alpine"}', 1, 0, 0);
INSERT INTO tech_course.section (course_id, chapter_id, template_id, name, description, seq, status, env, created_by, created_at, updated_at) VALUES (2, 2, 1, '第1节 读文件', '小试牛刀，初生牛犊不怕虎', 0, 0, '{"image": "node:7-alpine"}', 1, 0, 0);
INSERT INTO tech_course.section (course_id, chapter_id, template_id, name, description, seq, status, env, created_by, created_at, updated_at) VALUES (2, 3, 1, '第1节 发送HTTP请求', '让那天空听得见，让那白天看得见', 0, 0, '{"image": "node:7-alpine"}', 1, 0, 0);
INSERT INTO tech_course.section (course_id, chapter_id, template_id, name, description, seq, status, env, created_by, created_at, updated_at) VALUES (2, 2, 1, '第2节 读取当前目录', '输出当前目录下所有文件列表', 0, 0, '{}', 1, 0, 0);
INSERT INTO tech_course.section (course_id, chapter_id, template_id, name, description, seq, status, env, created_by, created_at, updated_at) VALUES (2, 2, 1, '第3节 边读边写', '读指定文件内容并写入到另一个文件中', 0, 0, '{"image": "node:7-alpine"}', 1, 0, 0);
`

main()

async function main() {
    let arr = sqls.split(';')
    try {
        await Query(`use ${config.database};`)
        for (let i = 0; i < arr.length; i++)
            if (arr[i])
                await Query(arr[i])

    } catch (err) {
        console.log(err)
    }
    connection.end()
}