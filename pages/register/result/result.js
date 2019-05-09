var util = require("../../../utils/util.js")
Page({

  data: {
    username: '',
  },

  intoIndex: function () {
    util.login()
  },

  onLoad: function (options) {
    this.setData({
      username: getApp().globalData.admin.loginName
    })
  },

})