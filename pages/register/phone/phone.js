// pages/register/phone/phone.js
var util=require("../../../utils/util.js")
var app = getApp()
const adminLength = 21
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    disabled: false,
    code:'',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    bcgImg: '/images/001.jpg',
    modal: true,
    modalTo: true,
    list: [],
    staffId: 0,
    values: '',
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },

  radioChange: function (e) {
    console.log('radio发生change事件')
    
    this.setData({
      staffId: e.detail.value
    })

  },
  getItemById: function(arr,id){
    for( var i = 0 ; i<arr.length ; i++){
      if(arr[i].id==id){
        return arr[i]
      }
    }
  },
  confirmTo: function(){
    this.setData({
      modalTo: true,
      modal: false,
    })
  },
  cancelTo: function(){
    this.setData({
      modalTo: true,
    })
    wx.navigateTo({
      url: '../userInfo/userInfo?data=' + this.data.values,
    })
  },
  cancel: function () {
    this.setData({
      modal: true,
      staffId: 0
    });
  },
  confirm: function () {
    var that = this
    if (this.data.staffId == 0) {
      wx.showToast({
        title: '未选择用户',
        icon: 'none',
        duration: 1500,
      })
    } else {
      that.setData({
        modal: true
      })

      console.log('恢复用户的信息')
      var userinfo = this.getItemById(this.data.list, this.data.staffId)
      var length = Object.getOwnPropertyNames(userinfo).length
      console.log(userinfo)
      console.log('length:'+length)
      if (length != adminLength){
        wx.request({
          url: app.globalData.server + "/SysWXUserAction/registerWXUser.do",
          data: {
            wxOpenId: app.globalData.openid,
            miniproId: app.globalData.realOpenid,
            username: userinfo.personName,
            address: userinfo.personCompany,
            phonenum: userinfo.phoneNo,
            photoURL: '',
            staffId: parseInt(that.data.staffId),
            picId: userinfo.picId,
          },
          method: 'post',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data.msg == 'ok') {
              util.login()
            } else {
              wx.showToast({
                title: '恢复失败',
                icon: 'none',
                duration: 1500
              })
            }
          },
        })
      }else{
        //恢复用户
        wx.request({
          url: getApp().globalData.server + '/SysWXUserAction/recoverUser.do',
          data: {
            userId: parseInt(that.data.staffId),
            openId: app.globalData.openid,
            miniproId: app.globalData.realOpenid,
          },
          method: 'post',
          success: (res) => {
            console.log(res)
            if (res.data.msg == 'ok') {
              util.login()
            } else {
              wx.showToast({
                title: '恢复失败',
                icon: 'none',
                duration: 1500
              })
            }
          }
        })
      }
      
    }
  },

  
  getPhoneValue: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    if (this.bindPhoneChange(e.detail.value)){
      this.setData({
        isaPhoneNum: true
      })
    }else{
      this.setData({
        isaPhoneNum: false
      })
    }
  },
  bindPhoneChange(num) {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if(num == "") {
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
    var that=this
    let values = e.detail.value
    let phoneNumber = values.phoneNumber || ''
    let code = values.code || ''
    if (util.checkForm(this,0)){
    // if (true) {
      var userId=0
      wx.request({
        url: getApp().globalData.server + '/SysWXUserAction/checkAdminIsExist.do?phoneNum=' + phoneNumber,
        method: 'post',
        success: (res)=>{
          console.log('门禁')
          console.log(res.data)
          var admins = res.data.users
          var staffs = res.data.persons
          var list=admins.concat(staffs)
          // for( var i=0;i<list.length;i++){
          //   console.log(Object.getOwnPropertyNames(list[i]).length)
          // }
          if (typeof (list[0]) != "undefined") {
            this.setData({
              list: list,
              modalTo: false
            })
            that.setData({
              values: JSON.stringify(values)
            })
          } else {
            wx.navigateTo({
              url: '../userInfo/userInfo?data=' + JSON.stringify(values),
            })
          }
          
        }
      })
      
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
    
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          util.login()
        }else{
          wx.redirectTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })

    //util.login()
  },

  onReady: function () {

  },

  onShow: function () {

  },

})