var util = require("../../../utils/util.js")
var app=getApp()
Page({

  data: {
    bcgImg: '/images/001.jpg',
    avatar: '',
    quality: 1,
    username: '',//姓名
    company: '',
    tag: true,
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
    var that = this
    var formId = e.detail.formId
    if(util.checkForm(this,2)){
      wx.request({
        url: app.globalData.server + '/TransitPerson/indepregistered.do',
        data: {
          clientId: parseInt(this.data.clientId + ''),
          personName: this.data.username,
          phoneNo: this.data.phoneNumber,
          picId: this.data.picId,
          openId: app.globalData.realOpenid,
          unionId: app.globalData.openid,
          formId: formId
        },
        method: 'post',
        success: res => {
          console.log("通知管理员")
          console.log(res)
          if (res.data.result == 'SUCCESS') {
            if (typeof (res.data.userList) != 'undefined' && res.data.userList.length>0){
              var list = res.data.userList
              for (var one of list) {
                //发送统一服务消息
                wx.request({
                  url: app.globalData.server + '/SysWXUserAction/sendUniMsg.do',
                  data: {
                    openId: one.openId,
                    miniAppid: 'wx218bf8cb1afb43a2',
                    templateId: 'yQRbgCf5pQ6zypI4ZNyNBj6stF7wV93w8O0Yt-ryDYw',
                    dto: {
                      first: { value: '申请加入' + that.data.company },
                      keyword1: { value: that.data.username },
                      keyword2: { value: util.getCurrentTime() },
                      remark: { value: '请相应管理员尽快处理' }
                    }
                  },
                  method: 'post',
                  success: res => {
                    console.log(res)
                  }
                })
              }
            }

            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            wx.redirectTo({
              url: '../result/result',
            })

          } else {
            wx.showToast({
              title: '抱歉!当前已存在用户，不可再申请',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: res => {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    
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

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let head = { clientId: 0, clientName: "选择单位" }
      wx.request({
        url: getApp().globalData.server + '/DoorDevice/getRelevanceUnits.do?devId=' + scene,
        method: 'post',
        success: res => {
          var arr = res.data
          arr.unshift(head)
          var values = arr.map(e => { return e.clientName })
          that.setData({
            array: arr,
            tag: false,
            values: values
          })
        },
        fail: res => {
          wx.showToast({
            title: '网络开小差，请稍后再试',
            icno: 'none',
            duration: 1500
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
        if (res.authSetting['scope.userInfo']) {
          //登录
          util.login()
        } else {
          wx.navigateTo({
            url: '/pages/authorize/authorize?authortag=1',
          })
        }
      }
    })
  },

  bindPickerChange: function(e){
    var clientId = this.data.array[e.detail.value].clientId
    this.setData({
      index: e.detail.value,
      clientId: clientId ,
      company: this.data.array[e.detail.value].clientName
    })
  },

  getUsername: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

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
      util.login()
    }
  },

  onShareAppMessage: function () {

  }
})