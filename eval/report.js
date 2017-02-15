const _ = require('lodash')

/**
 * Export a function which is designed to format the testing reports
 */
module.exports = function (result, tester) {
    if (tester === 'mocha') {
        return parseMochaResult(result)
    } else {
        throw new Error(`Unkknown tester : ${tester}`)
    }
}

function parseMochaResult(result) {
    let obj = JSON.parse(result)
    let r = {}
    r.time = new Date().getTime()
    r.ok = obj.stats.failures === 0
    r.passes = obj.stats.passes
    r.failures = obj.stats.failures
    r.tests = []
    obj.passes.forEach(t => {
        r.tests.push({
            title: t.title,
            passed: true,
            err: null
        })
    })
    obj.failures.forEach(t => {
        r.tests.push({
            title: t.title,
            passed: false,
            err: _parseMochaError(t.err)
        })
    })
    return r
}

const etype = {
    AssertionError: 'AssertionError',
    SyscallError: 'SyscallError',
    UserDefineError: 'UserDefineError',
    ChildProcessError: 'ChildProcessError'
}

function _parseMochaError(err) {
    let errorType = _type(err)
    let r = {
        errorType
    }

    if (errorType === etype.UserDefineError) {
        r.message = _.escape(err.message)
        r.stack = _.escape(err.stack)
        return r
    }

    if (errorType === etype.ChildProcessError) {
        r.message = _.escape(err.message.split('\n').shift())
        r.stack = _.escape(err.stack)
        r.killed = _.escape(err.killed)
        r.code = _.escape(err.killed)
        r.signal = _.escape(err.signal)
        r.cmd = _.escape(err.cmd)
        return r
    }

    if (errorType === etype.SyscallError) {
        r.message = _.escape(err.message)
        r.stack = _.escape(err.stack)
        r.code = _.escape(err.code)
        r.syscall = _.escape(err.syscall)
        // Not exhaustive, to be done
        r.address = _.escape(err.address)
        r.port = _.escape(err.port)
        return r
    }

    if (errorType === etype.AssertionError) {
        r.actual = _.escape(err.actual)
        r.expected = _.escape(err.expected)
        r.operator = _.escape(err.operator)
        r.message = _.escape(err.message)
        r.stack = _.escape(err.stack)
        return r
    }

    function _type(obj) {
        if (obj.name && obj.name === 'AssertionError')
            return etype.AssertionError
        else if (obj.syscall)
            return etype.SyscallError
        else if (obj.cmd)
            return etype.ChildProcessError
        else if (obj.message)
            return etype.UserDefineError
    }

    return error
}