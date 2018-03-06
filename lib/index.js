const { mixins } = require('./mixin')
const { getTimePeriod, getTimeStampArr, formateTime, convertTime } = require('./utils')
const Page = require('./page')

class McAccount {
  constructor (opts) {
    this.opts = opts
    mixins(this, opts)
  }

  async run () {
    const page = new Page(this.opts)
    await page.start()
    await page.login({
      email: this.email,
      pwd: this.pwd
    })
    let orderLenArr = await page.getOrderListNum(this.areas)
    const res = await page.getOrderListDetail(orderLenArr)
    let timeStampArr = getTimeStampArr(res)
    timeStampArr = timeStampArr.concat(...getTimeStampArr(this.exclude))
    const timePeriod = getTimePeriod(this.startDate, this.endDate)
    let arr = {}
    timePeriod.forEach((time, index) => {
      let timeStamp = new Date(time).valueOf()
      let _convertTime = convertTime(time)
      if (timeStampArr.indexOf(_convertTime) === -1) {
        const { year, month, val } = formateTime(timeStamp)
        if (!arr[year]) arr[year] = {}
        if (!arr[year][month]) arr[year][month] = []
        arr[year][month].push(val)
      }
    })
    console.log(arr)
    process.exit(0)
  }
}

module.exports = McAccount