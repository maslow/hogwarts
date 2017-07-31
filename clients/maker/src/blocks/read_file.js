module.exports = {
    init: function () {
        this.jsonInit({
            "message0": '读文件 %1',
            "args0": [
                {
                    "type": "input_value",
                    "name": "PATH",
                    "check": "String"
                }
            ],
            "output": "String",
            "colour": 170,
            "tooltip": "读文件，第一个参数为文件路径，返回文件内容，或返回空，如果文件不存在。"
        })
    }
}