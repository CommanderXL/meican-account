const { mixins } = require('./mixin')
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
    await page.getOrderListDetail(orderLenArr)
  }
}

module.exports = McAccount