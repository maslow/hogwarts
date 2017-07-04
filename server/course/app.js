const express = require("express")
const mysql = require("./mysql.js")
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

let app = express()


main()

async function main(){
    let ret = await mysql.GetConnection()
    console.log(ret)
    await mysql.Close()
}

