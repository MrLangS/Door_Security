var util = require("../../utils/util.js")
var app = getApp()
Page({
  data: {
    isAdmin: false
  },

  switchAccount: function(){
    wx.request({
      url: app.globalData.server + '/SysWXUserAction/getUserByPhoneNum.do?phoneNum=' + app.globalData.staff.phoneNo + '&type=' + 2,
      method: 'post',
      success: (res) => {
        app.globalData.userSet = res.data.persons
        wx.navigateTo({
          url: '../account/account',
        })
      }
    })
  },

  logout(){
    wx.showModal({
      title: '温馨提示',
      content: '确定要退出当前账号吗？',
      success: function(res){
        if(res.confirm){
          try{
            wx.clearStorageSync()
            wx.reLaunch({
              url: '../role/role',
            })
          } catch(e) {
            console.log(e)
          }
        }
      }
    })
  },

  onLoad: function (options) {
    console.log(app.globalData.isAdmin)
    this.setData({
      isAdmin: app.globalData.isAdmin
    })
  },
})