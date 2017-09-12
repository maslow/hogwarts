module.exports = {
  init: function () {
    this.jsonInit({
      "message0": '评测点 %1 %2',
      "args0": [{
        "type": "input_value",
        "name": "NAME",
        "check": "String"
      }, {
        "type": "input_statement",
        "name": "STATEMENTS"
      }],
      "colour": 70,
      "tooltip": "测试用例.",
    })
  }
}
