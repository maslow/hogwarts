module.exports = {
  init: function () {
    this.jsonInit({
      "message0": '检查 %1 是否等于 %2',
      "args0": [{
        "type": "input_value",
        "name": "ACTUAL",
        "check": "String"
      }, {
        "type": "input_value",
        "name": "EXPECTED",
        "check": "String"
      }],
      "nextStatement": "Action",
      "previousStatement": "Action",
      "colour": 10,
      "tooltip": "文本型断言（Assertion)，检查给定的两个文本是否一致.",
    })
  }
}
