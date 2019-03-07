const app = getApp()
var util = require("../../utils/util.js")
Page({
  data: {
    time: util.getCurrentTime()
  },
  onLoad: function () {
    var that=this

    
    // wx.request({
    //   url: getApp().globalData.server + '/SysWXUserAction/getBase64fromAQR.do',
    //   method: 'post',
    //   success: (res) => {
    //     console.log(res)
    //     that.setData({
    //       qrcode: 'data:image/png;base64,'+res.data.data
    //     })
    //   }
    // })
    //模版id: Odg89wXYvEd43h0E3VxgNlDWOCxnQQb4NAL4E60eh74
  },
})
