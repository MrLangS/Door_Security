var util = require("../../../utils/util.js")
var app=getApp()
Page({

  data: {
    bcgImg: '/images/001.jpg',
    avatar: '',
    quality: 1,
    username: '',//姓名
    company: '',
    duty: '',
    email: '',
    phoneNumber: '',
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    tag: true,
    picId: 0,
    progress: true,
    active: false,
    percent: 0,
    progressColor: '#eb4613',
    array: [],
    authorizeTAG: false,
    disabled: false,
    regDisabled: false,
    index: 0
  },

  commit: function(e) {
    var that = this
    var formId = e.detail.formId
    console.log('验证')
    if(util.checkForm(this,2)){
      if (!this.data.isEmpty) {
        return
      }
      if(!util.checkEmail(this.data.email)){
        return
      }
      this.setData({
        regDisabled: true
      })
      wx.request({
        url: app.globalData.server + '/TransitPerson/indepregistered.do',
        data: {
          clientId: parseInt(this.data.clientId + ''),
          personName: this.data.username,
          phoneNo: this.data.phoneNumber,
          duty: this.data.duty,
          email: this.data.email,
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
                    miniAppid: app.globalData.config.miniAppid,
                    templateId: app.globalData.config.joinTemplateId,
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
      that.setData({devId: scene})
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

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
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
    console.log('picker')
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
  getDuty: function (e) {
    this.setData({
      duty: e.detail.value
    })
  },
  getEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },

  getPhonenum: function(e){
    this.setData({
      phoneNumber: e.detail.value
    })
    var isaPhoneNum = this.bindPhoneChange(e.detail.value)
    if (isaPhoneNum) {
      if(this.data.devId){
        wx.request({
          url: app.globalData.server + '/TransitPerson/isExistThisUnit.do?devId='+this.data.devId+'&phoneNum='+this.data.phoneNumber,
          method: 'post',
          success: res => {
            this.setData({
              isEmpty: !res.data.isExist
            })
          }
        })
      } else{
        wx.request({
          url: app.globalData.server + '/TransitPerson/isExistThisUnit.do?clientId=' + this.data.clientId + '&phoneNum=' + this.data.phoneNumber,
          method: 'post',
          success: res => {
            this.setData({
              isEmpty: !res.data.isExist
            })
          }
        })
      }
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
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/;
    if (num == "") {
      return false;
    } else if (!myreg.test(num)) {
      return false;
    } else {
      return true
    }
  },
  //获取验证码
  getVerificationCode() {
    util.getCode(this,true)
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
              percent: 0,
            })
            that.setData({
              percent: 100,
              progressColor: '#eb4613',
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
                that.setData({
                  active: false,
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