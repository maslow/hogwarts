module.exports = {
  init: function () {
    this.jsonInit({
      "message0": '运行命令 %1',
      "args0": [{
        "type": "input_value",
        "name": "COMMAND",
        "check": "String"
      }],
      "output": "String",
      "colour": 170,
      "tooltip": "运行命令(Exec)，返回该命令执行后的标准输出文本.",
    })
  }
}
