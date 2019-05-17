var util = require("../../utils/util.js")
Page({

  data: {
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    disabled: false
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

  onLoad: function (options) {
    
  },

  
})