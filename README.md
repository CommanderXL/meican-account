

## How to

```javascript
const McAccount = require('meican-account')
const mcAccount = new McAccount({
  email: 'your login email',
  pwd: 'your password',
  startDate: '2017-1-1',
  endDate: '2017-12-31',
  exclude: ['2017-12-29', '2017-12-30'],        // 需要排除的日期
  areas: ['229763', '964371'],                  // 办公区
  headless: false                               // 是否是无头浏览器模式，默认为true
})

mcAccount.run()
```