const holidays = require('./dates')

function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

function urlParams(obj, isEncode) {
  isEncode = isEncode !== false
  let url = ''
  if (isObject(obj)) {
    for (var k in obj) {
      let value = obj[k] !== undefined ? obj[k] : ''
      url += '&' + k + '=' + (isEncode ? encodeURIComponent(value) : value)
    }
  }
  return url ? url.substring(1) : ''
}

function buildUrl(url, obj) {
  let query = url.slice(url.indexOf('?') + 1)
  let queryMap = query.split('&')
  queryMap.forEach((item) => {
    let keyValue = item.split('=')
    if (keyValue.length > 1 && keyValue[0] && obj.hasOwnProperty(keyValue[0])) {
      delete obj[keyValue[0]]
    }
  })

  return url + (url.indexOf('?') > -1 ? '&' : '?') + urlParams(obj)
}

function getTimePeriod (startDate, endDate) {
  const oneDayOfTimeStamp = 24 * 60 * 60 * 1000
  let formattedStartTime = new Date(startDate)
  let formattedEndTime = new Date(endDate)
  let startDay = formattedStartTime.getDay()
  let endDay = formattedEndTime.getDay()
  let startTimestamp  = formattedStartTime.valueOf()
  let endTimestamp = formattedEndTime.valueOf()
  const days = (endTimestamp - startTimestamp) / oneDayOfTimeStamp
  let resArr = []
  for (let i = 0; i <= days; i++) {
    startTimestamp += oneDayOfTimeStamp
    let _time = formateTime(startTimestamp)
    if (!isWeekend(_time) && !isHoliday(_time)) {
      resArr.push(_time)
    }
  }

  return resArr

  function isWeekend (time) {
    const day = new Date(time).getDay()
    return day === 0 || day === 6
  }

  function isHoliday (time) {
    let year = time.split('-')[0]
    let formatHolidayStamp = getTimeStampArr(holidays)
    return formatHolidayStamp.indexOf(new Date(time).valueOf()) > -1
  }
}

function getTimeStampArr (arr) {
  return arr.map(item => {
    return new Date(item).valueOf()
  })
}

function formateTime (time) {
  const date = new Date(time)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getHours()}`
}

exports.buildUrl = buildUrl
exports.urlParams = urlParams