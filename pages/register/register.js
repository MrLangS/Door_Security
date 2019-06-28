var util = require("../../utils/util.js")
var app = getApp()
Page({

  data: {
    username: '',//姓名
    company: '',
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    disabled: false,
    quality: 1,
    picId: 0,
    // progress: true,
    // active: false,
    // percent: 0,
    // progressColor: '#eb4613',
  },

  //获取验证码
  getVerificationCode() {
    util.getCode(this,true)
  },

  getPhoneValue: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    var isaPhoneNum = this.bindPhoneChange(e.detail.value)
    if (isaPhoneNum){
      wx.request({
        url: app.globalData.server + '/UserAction!isPhoneNumRepeated.do',
        data: { phoneNum: this.data.phoneNumber },
        method: 'post',
        success: res => {
          this.setData({
            isEmpty: res.data
          })
        }
      })
    } else{
      this.setData({
        isEmpty: false
      })
    }
    
    this.setData({
      isaPhoneNum: isaPhoneNum
    })
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

  register() {
    var that = this
    if (!this.data.isEmpty) {
      console.log(!this.data.isEmpty)
    }
    if(util.checkForm(this,3)){
      if(!this.data.isEmpty){
        return
      }
      // 查看是否授权
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success() {
              },
              fail(res) {
                wx.showToast({
                  title: '授权失败！',
                })
              }
            })
          } else {
            console.log("地理位置已授权")
          }
        }
      })

      wx.chooseLocation({
        success: function (res) {
          wx.request({
            url: getApp().globalData.server + '/ClientInfoAction!registerClient.do',
            data: {
              wxOpenId: app.globalData.openid,
              miniproId: app.globalData.realOpenid,
              clientName: that.data.company,
              siteName: res.name,
              address: res.address,
              longitude: res.longitude + '',
              latitude: res.latitude + '',
              username: that.data.username,
              phoneNum: that.data.phoneNumber,
              userPicId: that.data.picId,
              clientLogoURL: ''
            },
            header: {},
            method: 'post',
            dataType: 'json',
            success: function (res) {
              console.log(res)
              if(res.data.msg == 'ok') {
                wx.setStorageSync('userId', res.data.admin.id)
                wx.setStorageSync('isAdmin', 1)//1为管理员
              }
              wx.redirectTo({
                url: '../result/result?username=' + that.data.phoneNumber,
              })
            },
            fail: function (res) { },
          })
        },
      })
    }
  },

  onLoad: function (options) {
    
  },

  getUsername: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  getCompname: function (e) {
    this.setData({
      company: e.detail.value
    })
  },
  chooseImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/TransitPerson/uploadPhotoFromWx.do"
        var tempFilePaths = res.tempFilePaths
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            // console.log('data:image/png;base64,' + res.data)
            console.log(res)

            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                personPhoto: res.data
              },
              success: (res) => {
                console.log('上传图片请求结果：')
                console.log(res)
                if (res.data.msg == 'ok') {
                  that.setData({
                    avatar: res.data.photoURL,
                    picId: res.data.picId,
                    quality: 0,
                  })
                } else {
                  wx.showToast({
                    title: '上传失败,图片须为本人清晰头像',
                    icon: 'none',
                    duration: 1500
                  })
                }
              },
              fail: (res) => {
                wx.showToast({
                  title: '网络开小差，请稍后再试',
                  icon: 'none',
                  duration: 1500
                })
              },
              complete: (res) => {

              }
            })
          }
        })
      },
    })
  },

  progressIsOk: function () {
    console.log('ok')
  },
})