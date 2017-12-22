const cp = require('child_process')
const path = require('path')

let cmd = process.argv[2] || 'start'

let pwd = path.dirname(process.argv[1])

const auth_path = path.join(pwd, 'auth')
const eval_path = path.join(pwd, 'eval')
const course_path = path.join(pwd, 'course')
const job_path = path.join(pwd, 'job')
const gateway_path = path.join(pwd, 'gateway')

if (cmd === 'init') {
    cp.execSync(`docker run -d --name mysql.hogwarts -e MYSQL_ROOT_PASSWORD=kissme mysql:5.7`)
    
    cp.execSync(`docker run -d -v ${auth_path}:/app --name auth.hogwarts -e DEBUG=AUTH:* -w /app --link mysql.hogwarts node node app.js`)
    cp.execSync(`docker run -d -v ${eval_path}:/app --name eval.hogwarts -e DEBUG=EVAL:* -w /app node node app.js`)
    cp.execSync(`docker run -d -v ${course_path}:/app --name course.hogwarts -e DEBUG=COURSE:* -w /app --link mysql.hogwarts node node app.js`)
    cp.execSync(`docker run -d -v ${job_path}:/app --name job.hogwarts -e DEBUG=JOB:* -w /app --link mysql.hogwarts --link course.hogwarts --link eval.hogwarts node node app.js`)
    cp.execSync(`docker run -d -v ${gateway_path}:/app --name gateway.hogwarts -e DEBUG=GATEWAY:* -p 8888:80 -w /app --link auth.hogwarts --link course.hogwarts --link job.hogwarts node node app.js`)
    
    console.log('DATABASE MIGRATION...')
    
    setTimeout(() => {
        cp.execSync(`docker exec auth.hogwarts node migrate.js`)
        cp.execSync(`docker exec course.hogwarts node migrate.js`)
        cp.execSync(`docker exec job.hogwarts node migrate.js`)

        cp.execSync(`curl -d "email=test@step8step.com&password=kissme" http://localhost:8888/users`)
        console.log('DONE')
    }, 20 * 1000)
}

if (cmd === 'start') {
    cp.execSync(`docker start mysql.hogwarts`)
    cp.execSync(`docker start eval.hogwarts`)
    cp.execSync(`docker start auth.hogwarts`)
    cp.execSync(`docker start course.hogwarts`)
    cp.execSync(`docker start job.hogwarts`)
    cp.execSync(`docker start gateway.hogwarts`)
}

if (cmd === 'stop') {
    cp.execSync(`docker stop gateway.hogwarts`)
    cp.execSync(`docker stop auth.hogwarts`)
    cp.execSync(`docker stop job.hogwarts`)
    cp.execSync(`docker stop course.hogwarts`)
    cp.execSync(`docker stop eval.hogwarts`)
    cp.execSync(`docker stop mysql.hogwarts`)
}

if (cmd === 'restart') {
    cp.execSync(`docker restart gateway.hogwarts`)
    cp.execSync(`docker restart job.hogwarts`)
    cp.execSync(`docker restart course.hogwarts`)
    cp.execSync(`docker restart eval.hogwarts`)    
    cp.execSync(`docker restart auth.hogwarts`)
}

if (cmd === 'remove') {
    cp.execSync(`docker rm -f gateway.hogwarts`)
    cp.execSync(`docker rm -f job.hogwarts`)   
    cp.execSync(`docker rm -f course.hogwarts`)    
    cp.execSync(`docker rm -f auth.hogwarts`)
    cp.execSync(`docker rm -f eval.hogwarts`)
    cp.execSync(`docker rm -f mysql.hogwarts`)
}