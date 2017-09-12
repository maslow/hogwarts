const Blockly = require('node-blockly')
module.exports = function (block) {
  // String or array length.
  var argument0 = Blockly.Python.valueToCode(block, 'VALUE',
    Blockly.Python.ORDER_FUNCTION_CALL) || '\'\'';
  return ['len(' + argument0 + ')', Blockly.Python.ORDER_MEMBER];
}
