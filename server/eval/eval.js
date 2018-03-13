const cp = require('child_process')
const util = require('util')
const debug = require('debug')

const _log = debug('EVAL:PROD')
const _debug = debug('EVAL:DEV')

const resolve_report_result = require('./reporter/mocha')
const DATA_VOLUME_NAME = process.env['DATA_VOLUME_NAME'] || 'eval-data'

module.exports = {
    run
}

async function run(docker_image, src_path) {
    const container_name = get_container_name()
    const cmd = get_command(container_name, docker_image, src_path)
    _log('Docker Command: %s', cmd)

    return new Promise((resolve, reject) => {
        cp.exec(cmd, (error, stdout, stderr) => {
            _debug('Docker-run results, stdout: %O, stderr: %O', stdout, stderr)
            try {
                if (stdout) {
                    const ret = resolve_report_result(stdout)
                    resolve(ret)
                } else if (error) {
                    throw error
                } else{
                    throw new Error("Unknow Error, cmd: %s", cmd)
                }
            } catch (err) {
                _log("Docker-run caught an error: %o", error)
                reject(error)
            }
        })
    })
}

function get_container_name() {
    const time = (new Date()).getMilliseconds()
    const random_number = Math.random() * 10000 * 10000 | 0
    return `eval-task-container.${time}.${random_number}`
}

function get_command(container_name, docker_image, src_path) {
    return `docker run --rm --name ${container_name} --mount type=volume,source=${DATA_VOLUME_NAME},target=/data,readonly -e SRC_PATH=/data/${src_path} -w /data/${src_path} ${docker_image} sh run.sh`
}