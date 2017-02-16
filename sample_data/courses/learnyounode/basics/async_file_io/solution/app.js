require('fs')
    .readFile(process.argv[2], (err, data) => {
        let lines = data
            .toString()
            .split('\n')
            .length
        console.log(lines)
    })