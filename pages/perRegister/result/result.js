var util = require("../../../utils/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  intoIndex: function () {
    var encryptedData = null
    var iv = null
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code

        if (code) {
          console.log('获取用户登录凭证：' + code);
          wx.getUserInfo({
            success: function (res) {
              encryptedData = res.encryptedData
              iv = res.iv
              //用户已经授权过
              var loginUrl = getApp().globalData.server + '/SysWXUserAction/onLogin.do';
              // --------- 发送凭证 ------------------
              wx.request({
                url: loginUrl,
                data: {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv,
                  userType: '3'
                },
                method: 'post',
                success: function (res) {
                  var openid = res.data.openid //返回openid
                  console.log("openid is: " + openid);
                  console.log("realopenid is: " + res.data.miniproId);
                  app.globalData.openid = openid
                  app.globalData.realOpenid = res.data.miniproId
                  var wxUser = res.data.sysWXUser
                  if (wxUser) {
                    console.log('wxUser:')
                    console.log(wxUser)
                    app.globalData.sysWXUser = wxUser
                    var userId = wx.getStorageSync('userId')
                    if (userId) {
                      var type = wx.getStorageSync('isAdmin')
                      wx.request({
                        url: getApp().globalData.server + '/SysWXUserAction/checkPersonStatus.do?id=' + userId + '&type=' + type,
                        method: 'post',
                        success: res => {
                          console.log('User:')
                          console.log(res)
                          if (type == 1) {// 1为管理员
                            app.globalData.admin = res.data.user
                            app.globalData.isAdmin = true
                            app.globalData.isMajorUser = res.data.isMajorUser
                            wx.switchTab({
                              url: '../../company/company',
                            })
                          } else {
                            app.globalData.isAdmin = false
                            app.globalData.staff = res.data.person
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                          }

                        }
                      })

                    } else {
                      wx.redirectTo({
                        url: '../../role/role',
                      })
                    }
                  } else {
                    console.log('未拥有微信用户')
                    wx.redirectTo({
                      url: '../../role/role',
                    })
                  }
                },
                fail: function () {
                  wx.showToast({
                    title: '网络异常，请刷新重试!',
                    icon: 'none',
                    duration: 2000
                  })
                  console.log("fail")
                }
              })
            }
          })

        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    })
  },
})