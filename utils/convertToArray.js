const fs = require('fs')
const {ethers} = require('ethers')
const {parse} = require('csv-parse')

const addressArray = []

fs.createReadStream('./utils/aaa.csv')
    .pipe(parse({delimiter: ','}))
    .on("data", row => {
        let parseRow = [row[0], ethers.utils.parseEther(row[1]).toString()]
        addressArray.push(parseRow)
    })
    .on("end", () => {
        fs.writeFileSync('./utils/addresses.js', JSON.stringify(addressArray))
    })

