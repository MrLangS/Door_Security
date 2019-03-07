var util = require("../../../utils/util.js")
var app=getApp()
Page({

  data: {
    bcgImg: '/images/001.jpg',
    avatar: '',
    quality: 1,
    username: '',//姓名
    company: '',
    picId: 0,
    progress: true,
    active: false,
    percent: 0,
    progressColor: '#3281ff',
    array: [],
    authorizeTAG: false,
    index: 0
  },

  commit: function(e) {
    util.checkForm(this,2)
    var that=this
    var formId = e.detail.formId
    
    wx.request({
      url: app.globalData.server + '/TransitPerson/indepregistered.do',
      data: {
        clientId: parseInt(this.data.clientId+''),
        personName: this.data.username,
        phoneNo: this.data.phoneNumber,
        picId: this.data.picId,
        openId: app.globalData.realOpenid,
        unionId: app.globalData.openid,
        formId: formId
      },
      method: 'post',
      success: res=>{
        if(res.data.result=='SUCCESS'){
          wx.showToast({
            title: '提交成功，请耐心等待管理员审核',
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '提交失败，请核对信息是否正确',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: res=>{
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  onLoad: function (options) {
    var that = this

    if (typeof (options.clientId) != 'undefined') {
      this.setData({
        clientId: options.clientId
      })
    }

    if (typeof (options.companyName) != 'undefined') {
      this.setData({
        company: options.companyName
      })
    }

    if (typeof (options.deviceId) != 'undefined') {
      let head = { "clientId": 0, "clientName": "选择单位" }
      wx.request({
        url: getApp().globalData.server + '/DoorDevice/getRelevanceUnits.do?devId=' + options.deviceId,
        method: 'post',
        success: res => {
          that.setData({
            array: res.data.unshift(head)
          })
        }
      })
    }

    //设置导航栏背景色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0e122b',
      animation: {
        duration: 50,
        timingFunc: 'easeIn'
      }
    })

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          //登录
          util.login2getId()
        } else {
          wx.navigateTo({
            url: '/pages/authorize/authorize?authortag=1',
          })
        }
      }
    })
  },

  bindPickerChange: function(e){
    var clientId = this.data.array[e.detail.value]
    this.setData({
      index: e.detail.value,
      clientId: clientId
    })
  },

  getUsername: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  // getCompname: function (e) {
  //   this.setData({
  //     company: e.detail.value
  //   })
  // },
  getPhonenum: function(e){
    this.setData({
      phoneNumber: e.detail.value
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
            that.setData({
              progress: false,
              percent: 100,
              active: true
            })
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
                  that.setData({
                    progressColor: 'red',
                  })
                  wx.showToast({
                    title: '上传失败,图片须为本人清晰头像',
                    icon: 'none',
                    duration: 1500,
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
                that.setData({
                  progress: true,
                  percent: 0,
                  active: false,
                  progressColor: '#3281ff'
                })
              }
            })
          }
        })
      },
    })
  },

  onShow: function () {
    if (this.data.authorizeTAG) {
      //登录
      util.login2getId()
    }
  },

  onShareAppMessage: function () {

  }
})