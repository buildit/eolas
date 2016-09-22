const generateStatusTestData = require('./generateStatusTestData')
const fs = require('fs')
const moment = require('moment')

const projectName = 'test-' + moment().format('YYYY-MM-DD-hh:mm:ss')

const filePath = `./data/${projectName}-demand.json`

const testData = generateStatusTestData()
const savableTestData = JSON.stringify(testData)

fs.writeFile(filePath, savableTestData, error => {
  if (error) throw error
  console.log('Saved test data:', filePath);
})
