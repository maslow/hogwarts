let sum = process.argv
        .slice(2)
        .reduce((p, c)=>Number(p)+Number(c))
console.log(sum)