/**
 * Created by wangfugen on 7/28/16.
 */
const fs = require('fs-extra')
const mysql = require('mysql')
const path = require('path')

let config = fs.readJsonSync(path.join(__dirname, 'db.json'))
let host = config.host
let user = config.user
let passwd = config.passwd
// let db = config.db

module.exports = function () {
    return {
        connect: function () {
            if (!this._conn) {
                this._conn = mysql.createConnection({
                    host: host,
                    user: user,
                    password: passwd,
                    database: db
                })
                this._conn.connect(function (err) {
                    if (err) throw err
                })
            }
            return this._conn
        },
        query: function (sql, params) {
            let self = this
            return new Promise((resolve, reject) => {
                self.connect().query(sql, params, (err, result) => err ? reject(err) : resolve(result))
            })
        },
        close: function () {
            if (null !== this._conn) {
                this._conn.end()
                this._conn = null
            }
        }
    }
}
