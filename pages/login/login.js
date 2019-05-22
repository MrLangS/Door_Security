var util = require("../../utils/util.js")
var app = getApp()
Page({

  data: {
    current: true,
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    username:'',
    password:'',
    disabled: false
  },

  register: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  },

  login: function() {
    var type = (this.data.isAdmin ? 1 : 2)
    if(this.data.current){
      //手机号登录
      if(util.checkForm(this,999)){
        
        //根据手机号获得管理员信息
        wx.request({
          url: getApp().globalData.server + '/SysWXUserAction/getUserByPhoneNum.do?phoneNum=' + this.data.phoneNumber+'&type='+type,
          method: 'post',
          success: (res) => {
            if(type == 1){
              if(res.data.user){
                var userId = res.data.user.id
                wx.setStorageSync('userId', userId)
                wx.setStorageSync('isAdmin', type)//1为主管理员
                //自动注册微信用户（有的话则不注册）
                util.registerWxUser(userId, type)
              }else{
                wx.showToast({
                  title: '当前手机号未注册',
                  icon: 'none',
                  duration: 2000
                })
              }
              
            } else{
              console.log(res)
              if (res.data.persons && res.data.persons.length>0){
                app.globalData.userSet = res.data.persons
                wx.navigateTo({
                  url: '../account/account',
                })
              }else{
                wx.showToast({
                  title: '当前手机号未注册',
                  icon: 'none',
                  duration: 2000
                })
              }
              
            }
            
          }
        })
      }
    } else {
      //账号密码登录
      var account = this.data.username.trim()
      var password = this.data.password.trim()
      if (account== "") {
        wx.showToast({
          title: '请输入账号',
          icon: 'none',
          duration: 1000
        })
        return
      }
      if (password == "") {
        wx.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 1000
        })
        return
      }
      
      wx.request({
        url: getApp().globalData.server + '/LoginAction/loginFromWx.do?username=' + account + '&password=' + password,
        method: 'post',
        success: (res) => {
          console.log(res)
          if(res.data.result){
            var userId = res.data.msg.id
            wx.setStorageSync('userId', userId)
            wx.setStorageSync('isAdmin', 1)//1为主管理员
            //自动注册微信用户（已有的话则不注册）
            util.registerWxUser(userId, 1)
          }else{
            if (res.data.msg =='AccountFailed'){
              wx.showToast({
                title: '账号不存在',
                icon: 'none',
                duration: 1000
              })
            }
            if (res.data.msg == 'PassWordFailed') {
              wx.showToast({
                title: '密码错误！',
                icon: 'none',
                duration: 1000
              })
            }
          }
          
        }
      })
    }

  },

  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },

  getAccount(e){
    this.setData({
      username: e.detail.value
    })
  },
  getPassword(e) {
    this.setData({
      password: e.detail.value
    })
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