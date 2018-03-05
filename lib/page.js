const puppeteer = require('puppeteer')
const { mixins } = require('./mixin')
const {
  EMAIL,
  PWD,
  SIGNIN,
  SHOW_ALL_BTN,
  ACTION_ICON_WRAPPER,
  BALANCE_HERF
} = require('./selectors')
const { 
  ORDER_LIST,
  LOGIN_PAGE
} = require('./urls')
const { 
  buildUrl
} = require('./utils')

// headless | startDate | endDate
class Page {
  constructor (opts) {
    this.opts = opts
    this.browser = null
    mixins(this, opts)

    this.dateObj = {
      startDate: this.startDate,
      endDate: this.endDate
    }
  }

  async start () {
    this.browser = await puppeteer.launch({
      headless: false
    })
    this.page = await this.browser.newPage()
  }

  async login (info) {
    const { email, pwd } = info
    await this.page.goto(LOGIN_PAGE)
    await this.page.type(EMAIL, email)
    await this.page.type(PWD, pwd)
    await this.page.click(SIGNIN)
  }

  async jumpToAccoutPage () {
    await this.page.click(SHOW_ALL_BTN)
    await this.page.click(ACTION_ICON_WRAPPER)
    await this.page.click(BALANCE_HERF)
  }

  getOrderUrls (areaId, index = 1) {
    const url = `${ORDER_LIST}/${areaId}`
    let _arr = []
    while (index > 0) {
      _arr.push(buildUrl(`${url}/${index--}`, this.dateObj))
    }
    return _arr
  }

  async getOrderListNum (areas) {
    const browser = this.browser
    const urls = areas.map(id => {
      return this.getOrderUrls(id)[0]
    })

    const pFns = urls.map(async _url => await gotoOrderPage(_url))

    return Promise.all(pFns).then(res => res)

    async function gotoOrderPage (url) {
      const page = await browser.newPage()
      await page.goto(url)
      const num = await page.evaluate(() => {
        const pNode = document.querySelector('.page_control')
        if (!pNode.childNodes) {
          return 0
        }
        const cNodes = pNode.querySelectorAll('a')
        return (!cNodes.length ? 1 : cNodes.length + 1)
      })
      await page.close()
      return num
    }
  }

  // 获取每页的订单时间
  async getOrderListDetail (orderLenArr) {
    const urlList = this.areas.map((id, index) => this.getOrderUrls(id, orderLenArr[index]))
    let iterator = urlList[Symbol.iterator]()
    let res = []

    const nextReq = () => {
      let promise
      for (let next = iterator.next(); !next.done; next = iterator.next()) {
        promise = this.getOrderTimeParallel(next.value)
        break;
      }

      if (!promise) {
        return res
      }

      return promise.then((_res) => {
        res = res.concat(_res)
        return nextReq()
      })
    } 
    
    return nextReq()
  }

  async getOrderTimeParallel (urls) {
    const browser = this.browser
    let urlPromises = urls.map(async url => {
      return await getTime(url)
    })

    return Promise.all(urlPromises).then(res => res)

    async function getTime(url) {
      const page = await browser.newPage()
      await page.goto(url)
      const timeArr = await page.evaluate(() => {
        const orderList = [...document.querySelectorAll('table.order_list a')]
        return orderList.map(node => node.innerHTML.split(' ')[0])
      })
      await page.close()
      return timeArr
    }
  }
}

module.exports = Page