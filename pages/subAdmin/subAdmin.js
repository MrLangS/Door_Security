var app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorizeTAG: false,
    subAdmin: {},
    phoneNumber: '',
    quality: 1,
    disabled: false,
    regDisabled: false,
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    bcgImg: '/images/001.jpg',
  },
  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },

  getPhoneValue: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })

    this.setData({
      isaPhoneNum: this.bindPhoneChange(e.detail.value)
    })
  },
  bindPhoneChange(num) {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/;
    if (num == "") {
      return false;
    } else if (!myreg.test(num)) {
      return false;
    } else {
      return true
    }
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  commit(e) {
    let values = e.detail.value
    let phoneNumber = values.phoneNumber || ''
    let code = values.code || ''

    if (util.checkForm(this, 0)) {

      this.setData({
        regDisabled: true
      })
      var subAdmin = this.data.subAdmin
      if (phoneNumber == subAdmin.phone){
        wx.request({
          url: getApp().globalData.server + '/UserAction!saveSubAdmin.do',
          data: {
            wxOpenId: getApp().globalData.openid,
            miniproId: getApp().globalData.realOpenid,
            unitName: subAdmin.companyName,
            clientId: parseInt(subAdmin.companyId),
            username: subAdmin.name,
            phoneNum: subAdmin.phone,
            userPicId: this.data.picId,
          },
          method: 'post',
          success: function (res) {
            console.log(res)
            wx.setStorageSync('userId', res.data.admin.id)
            wx.setStorageSync('isAdmin', 1)//1为管理员
            util.login(true)
          }
        })
        wx.showToast({
          title: '手机号匹配成功！',
          icon: 'none',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '手机号不匹配，绑定失败！若确认手机号无误请与相应管理员联系!',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //设置导航栏背景色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0e122b',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    if(typeof(options.subAdmin)!="undefined"){
      console.log(options.subAdmin)
      this.setData({
        subAdmin: JSON.parse(options.subAdmin)
      })
    }
    var subAdmin=true
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          //登录
          util.login2getId(subAdmin)

        } else {
          wx.navigateTo({
            url: '/pages/authorize/authorize?authortag=1',
          })
        }
      }
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

  onReady: function () {

  },

  onShow: function () {
    if (this.data.authorizeTAG) {
      //登录
      util.login2getId(true)
    }
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

})