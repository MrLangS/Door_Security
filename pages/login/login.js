var util = require("../../utils/util.js")
var app = getApp()
Page({

  data: {
    current: true,
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    disabled: false
  },

  register: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  },

  login: function() {
    if(util.checkForm(this,999)){
      wx.request({
        url: getApp().globalData.server + '/SysWXUserAction/checkAdminIsExist.do?phoneNum=' + this.data.phoneNumber,
        method: 'post',
        success: (res) => {
          console.log(res)
          app.globalData.userSet = res.data
          wx.reLaunch({
            url: '../account/account?isAdmin='+(this.data.isAdmin == 1 ? 1 : 0),
          })
        }
      })
    }else{
    }
  },

  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },

  getPhoneValue: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    if (this.bindPhoneChange(e.detail.value)) {
      this.setData({
        isaPhoneNum: true
      })
    } else {
      this.setData({
        isaPhoneNum: false
      })
    }
  },

  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  bindPhoneChange(num) {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (num == "") {
      return false;
    } else if (!myreg.test(num)) {
      return false;
    } else {
      return true
    }
  },

  switchToAccount: function () {
    this.setData({
      current: false
    })
  },

  switchToPhone: function () {
    this.setData({
      current: true
    })
  },

  onLoad: function (options) {
    var isAdmin = (1 == options.isAdmin) ? true : false;
    this.setData({
      isAdmin : isAdmin
    })
    if(!isAdmin) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#36c8c3',
        animation: {
        }
      })
    }
    
  },
})