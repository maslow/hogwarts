const parseMochaResult = require('./reports/mocha.js')
/**
 * Export a function which is designed to format the testing reports
 */
module.exports = function (result, tester) {
    if (tester === 'mocha') {
        return parseMochaResult(result)
    }
    throw new Error(`Unkknown tester : ${tester}`)
}