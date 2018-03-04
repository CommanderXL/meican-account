const puppeteer = require('puppeteer')
const {
  EMAIL,
  PWD,
  SIGNIN,
  SHOW_ALL_BTN,
  ACTION_ICON_WRAPPER,
  BALANCE_HERF
} = require('./selectors')
const { 
  ORDER_LIST
} = require('./urls')
const { 
  buildUrl
} = require('./utils')

class Page {
  constructor (opts) {
    this.browser = null
    this.headless = opts.headless || true
  }

  async start () {
    this.browser = await puppeteer.launch({
      headless: false
    })
    this.page = await this.browser.newPage()
  }

  async login (info) {
    const { email, pwd } = info
    await this.page.goto('https://meican.com/login')
    await this.page.type(EMAIL, email)
    await this.page.type(PWD, pwd)
    await this.page.click(SIGNIN)
    await new Promise(resolve => setTimeout(resolve, 10000))
  }

  async jumpToAccoutPage () {
    await this.page.click(SHOW_ALL_BTN)
    await this.page.click(ACTION_ICON_WRAPPER)
    await this.page.click(BALANCE_HERF)
  }

  async getOrderListNum (areas) {
    const browser = this.browser
    const urls = areas.map(item => {
      let _url = `${ORDER_LIST}/${item}/1`
      return buildUrl(_url, {
        startDate: this.startDate,
        endDate: this.endDate
      })
    })

    async function gotoOrderPage () {
      const page = await browser.newPage()
      await page.goto(url)
      await page.evaluate(() => {
        const pNode = document.querySelector('.page_control')
        if (!pNode.childNodes) {
          return 0
        }
        const cNodes = pNode.querySelectorAll('a')
        return (!cNodes.length ? 1 : cNodes.length + 1)
      })
    }
  }

  async getOrderListDetail (opts) {
    const page = this.browser.newPage()
    await page.goto()
  }
}

module.exports = Page