function mixins (target, obj) {
  for (let key in obj) {
    target[key] = obj[key]
  }
}

exports.mixins = mixins