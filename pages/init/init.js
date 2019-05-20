var util = require("../../utils/util.js")
Page({

  data: {

  },

  onLoad: function (options) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
      duration: 3000
    })
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          util.login()
        } else {
          wx.redirectTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
    // util.login()
  },
  
})