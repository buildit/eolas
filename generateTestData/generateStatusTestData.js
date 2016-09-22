const moment = require('moment')

module.exports = () => {
  const dayOne = moment()
  var result = []
  var nextValue = Math.floor(Math.random() * 5)
  for (var i = 1; i <= 180; i++) {
    const projectDate = dayOne.add(1, 'days').format('YYYY/MM/DD')
    const status = {
      "Backlog": 300 - nextValue,
      "Done": nextValue
    }
    result.push({
      projectDate,
      status
    })

    var incrementValue = Math.random() > 0.3 ? Math.random() * 10 + 3 : 0

    if (nextValue > 300) {
      Math.random() > 0.5 ? nextValue += incrementValue : nextValue -= incrementValue
    } else {
      nextValue += incrementValue
    }
  }
  return result
}
