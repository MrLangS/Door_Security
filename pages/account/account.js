var app = getApp()
var util = require("../../utils/util.js")
Page({

  data: {

  },

  goToStaffLogin(e){
    var index = e.currentTarget.dataset.index
    var userinfo = this.data.staffs[index]
    var userId = userinfo.id

    wx.setStorageSync('userId', userId)
    wx.setStorageSync('isAdmin', 2)//1为管理员
    wx.request({
      url: getApp().globalData.server + '/SysWXUserAction/checkPersonStatus.do?id=' + userId + '&type=' + 2,
      method: 'post',
      success: res => {
        console.log('User:')
        console.log(res)
        app.globalData.isAdmin = false
        app.globalData.staff = res.data.person
        //判断有没有微信用户，不存在的话重新注册
        if (!app.globalData.sysWXUser) {
          console.log('注册微信用户')
          wx.request({
            url: app.globalData.server + "/SysWXUserAction/registerWXUser.do",
            data: {
              wxOpenId: app.globalData.openid,
              miniproId: app.globalData.realOpenid,
              username: userinfo.personName,
              address: userinfo.personCompany,
              phonenum: userinfo.phoneNo,
              photoURL: '',
              staffId: userinfo.id,
              picId: userinfo.picId,
            },
            method: 'post',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res)
              if (res.data.msg == 'ok') {
                app.globalData.sysWXUser = res.data.sysWXUser
                wx.reLaunch({
                  url: '../index/index',
                })
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none',
                  duration: 1500
                })
              }
            },
          })
        } else {
          wx.reLaunch({
            url: '../index/index',
          })
        }
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      staffs: app.globalData.userSet
    })
  },

  onShow: function () {

  },

})