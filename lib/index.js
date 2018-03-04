const { mixins } = require('./mixin')
const Page = require('./page')

class McAccount {
  constructor (opts) {
    mixins(this, opts)
  }

  async run () {
    const page = new Page({
      headless: false
    })
    await page.start()
    await page.login({
      email: this.email,
      pwd: this.pwd
    })
    let arr = await page.getOrderListNum(this.areas)
    console.log(arr)
  }
}

module.exports = McAccount