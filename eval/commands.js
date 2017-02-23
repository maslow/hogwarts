let cmds = [
    {
        lang: 'node',
        tester: 'mocha',
        image: 'node:mocha',
        cmd: 'mocha -t 10000 /app/tests -R json'
    },
    {
        lang: 'php',
        tester: 'mocha',        
        image: 'php:7.1-mocha',
        cmd: 'mocha -t 10000 /app/tests -R json'
    }
]

module.exports = cmds