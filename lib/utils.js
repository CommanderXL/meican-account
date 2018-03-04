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

exports.buildUrl = buildUrl
exports.urlParams = urlParams