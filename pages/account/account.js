var app = getApp()
var util = require("../../utils/util.js")
Page({

  data: {

  },

  goToAdminLogin(e){
    var index = e.currentTarget.dataset.index
    wx.setStorageSync('userId', this.data.admins[index].id)
    console.log(wx.getStorageSync('userId'))
    wx.setStorageSync('isAdmin', 1)//1为管理员
    util.login()
  },

  onLoad: function (options) {
    // this.setData({
    //   staffs: app.globalData.userSet.persons
    // })
  },

  onShow: function () {

  },

})