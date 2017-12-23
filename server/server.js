const cp = require('child_process')
const path = require('path')

let cmd = process.argv[2] || 'start'

let pwd = path.dirname(process.argv[1])

const auth_path = path.join(pwd, 'auth')
const eval_path = path.join(pwd, 'eval')
const course_path = path.join(pwd, 'course')
const job_path = path.join(pwd, 'job')
const gateway_path = path.join(pwd, 'gateway')

const server_auth = 'auth.hogwarts'
const server_eval = 'eval.hogwarts'
const server_course = 'course.hogwarts'
const server_job = 'job.hogwarts'
const server_gateway = 'gateway.hogwarts'

if (cmd === 'init') {
    cp.execSync(`docker network create hogwarts`)
    cp.execSync(`docker run -d --network hogwarts --name mysql.hogwarts --mount type=volume,source=mysql.data,target=/var/lib/mysql -e MYSQL_ROOT_PASSWORD=kissme mysql:5.7`)
    
    cp.execSync(`docker run -d --network hogwarts -v ${auth_path}:/app --name ${server_auth} -e DEBUG=AUTH:* -w /app -e SERVER_MYSQL=mysql.hogwarts node node app.js`)
    cp.execSync(`docker run -d --network hogwarts -v ${eval_path}:/app --name ${server_eval} -e DEBUG=EVAL:* -w /app node node app.js`)
    cp.execSync(`docker run -d --network hogwarts -v ${course_path}:/app --name ${server_course} -w /app -e DEBUG=COURSE:* -e SERVER_MYSQL=mysql.hogwarts node node app.js`)
    cp.execSync(`docker run -d --network hogwarts -v ${job_path}:/app --name ${server_job} -w /app -e DEBUG=JOB:* -e SERVER_MYSQL=mysql.hogwarts -e SERVER_COURSE=${server_course} -e SERVER_EVAL=${server_eval} node node app.js`)
    cp.execSync(`docker run -d --network hogwarts -v ${gateway_path}:/app --name ${server_gateway}  -p 8888:80 -w /app -e DEBUG=GATEWAY:* -e SERVER_AUTH=${server_auth} -e SERVER_COURSE=${server_course} -e SERVER_JOB=${server_job} node node app.js`)
    
    console.log('DATABASE MIGRATION...')
    
    setTimeout(() => {
        cp.execSync(`docker exec ${server_auth} node migrate.js`)
        cp.execSync(`docker exec ${server_course} node migrate.js`)
        cp.execSync(`docker exec ${server_job} node migrate.js`)

        cp.execSync(`curl -d "email=test@step8step.com&password=kissme" http://localhost:8888/users`)
        console.log('DONE')
    }, 20 * 1000)
}

if (cmd === 'start') {
    cp.execSync(`docker start mysql.hogwarts`)
    cp.execSync(`docker start ${server_eval}`)
    cp.execSync(`docker start ${server_auth}`)
    cp.execSync(`docker start ${server_course}`)
    cp.execSync(`docker start ${server_job}`)
    cp.execSync(`docker start ${server_gateway}`)
}

if (cmd === 'stop') {
    cp.execSync(`docker stop ${server_gateway}`)
    cp.execSync(`docker stop ${server_auth}`)
    cp.execSync(`docker stop ${server_job}`)
    cp.execSync(`docker stop ${server_course}`)
    cp.execSync(`docker stop ${server_eval}`)
    cp.execSync(`docker stop mysql.hogwarts`)
}

if (cmd === 'restart') {
    cp.execSync(`docker restart ${server_gateway}`)
    cp.execSync(`docker restart ${server_job}`)
    cp.execSync(`docker restart ${server_course}`)
    cp.execSync(`docker restart ${server_eval}`)    
    cp.execSync(`docker restart ${server_auth}`)
}

if (cmd === 'remove') {
    cp.execSync(`docker rm -f ${server_gateway}`)
    cp.execSync(`docker rm -f ${server_job}`)   
    cp.execSync(`docker rm -f ${server_course}`)    
    cp.execSync(`docker rm -f ${server_auth}`)
    cp.execSync(`docker rm -f ${server_eval}`)
    cp.execSync(`docker rm -f mysql.hogwarts`)
    cp.execSync(`docker network rm hogwarts`)
}