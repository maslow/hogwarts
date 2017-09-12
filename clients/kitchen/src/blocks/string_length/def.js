module.exports = {
  init: function () {
    this.jsonInit({
      "message0": 'length of %1',
      "args0": [{
        "type": "input_value",
        "name": "VALUE",
        "check": "String"
      }],
      "output": "Number",
      "colour": 160,
      "tooltip": "Returns number of letters in the provided text.",
    });
  }
}