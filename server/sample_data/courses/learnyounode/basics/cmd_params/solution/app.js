var argv = process.argv
var sum = 0
for (var i = 2; i < argv.length; i++) {
	sum += Number(argv[i])
}
console.log(sum)

/*
let sum = process.argv.slice(2)
        .reduce((p, c)=>Number(p)+Number(c))
console.log(sum)
*/