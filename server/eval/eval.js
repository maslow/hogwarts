const cp = require('child_process')
const util = require('util')
const debug = require('debug')

const _log = debug('EVAL:PROD')
const _debug = debug('EVAL:DEV')

const resolve_report_result = require('./reporter/mocha')

const exec_async = util.promisify(cp.exec)

module.exports = {
    run
}

async function run(docker_image, src_path) {
    const container_name = get_container_name()
    const cmd = get_command(container_name, docker_image, src_path) 
    _log('Docker Command: %s', cmd)

    try {
        const [stdout, stderr] = await exec_async(cmd)
        _debug('Docker-run results, stdout: %O, stderr: %O', stdout, stderr)
        const ret = resolve_report_result(stdout)
        return ret
    } catch (err) {
        _log("Docker-run caught an error: %o", err)
        return null
    }
}

function get_container_name(){
    const time = (new Date()).getMilliseconds()
    const random_number = Math.random() * 10000 * 10000 | 0
    return `job-testing-container.${time}.${random_number}`
}

function get_command(container_name, docker_image, src_path){
    return `docker run --rm --mount type=volume,source=eval.data,target=/tmp/eval_data,readonly -e SRC_PATH=${src_path} ${docker_image} sh run.sh`
}