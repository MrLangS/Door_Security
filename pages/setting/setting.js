var util = require("../../utils/util.js")
Page({
  data: {

  },

  switchAccount: function(){
    wx.navigateTo({
      url: '../account/account',
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

  },
})