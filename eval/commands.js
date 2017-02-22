let cmds = [
    {
        lang: 'node',
        tester: 'mocha',
        cmd: 'mocha -t 10000 /app/tests -R json'
    },
    {
        lang: 'php',
        version: '7.1',
        tester: 'codecept',
        cmd: 'codecept run -c /app/codeception.yml --json | cat /app/tests/_output/report.json'
    }
]

module.exports = cmds