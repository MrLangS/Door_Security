Page({

  data: {
    username: '',
  },

  intoIndex: function () {
    console.log("index")
    wx.reLaunch({
      url: '../../device/device',
    })
  },

  onLoad: function (options) {
    this.setData({
      username: getApp().globalData.admin.loginName
    })
  },

})