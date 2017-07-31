module.exports = {
    init: function () {
        this.jsonInit({
            "message0": '写文件 %1 内容 %2',
            "args0": [
                {
                    "type": "input_value",
                    "name": "PATH",
                    "check": "String"
                }, {
                    "type": "input_value",
                    "name": "DATA",
                    "check": "String"
                }
            ],
            "output": "String",
            "colour": 170,
            "tooltip": "写文件，第一个参数为文件路径，第二参数为将写入文件的内容。"
        })
    }
}