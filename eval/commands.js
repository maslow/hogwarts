let cmds = [
    {
        lang: 'node',
        tester: 'mocha',
        image: 'node:mocha',
        cmd: 'mocha -t 10000 /app/tests -R json'
    },
    {
        lang: 'php',
        tester: 'codecept',        
        image: 'php:7.1-codecept',
        cmd: 'codecept run -c /app/codeception.yml --json | cat /app/tests/_output/report.json'
    }
]

module.exports = cmds