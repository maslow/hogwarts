module.exports = {
  init: function () {
    this.jsonInit({
      "message0": '评测前准备 %1',
      "args0": [{
        "type": "input_statement",
        "name": "STATEMENTS"
      }],
      "colour": 70,
      "tooltip": "评测前准备工作，在所有评测点执行之前执行.",
    })
  }
}
