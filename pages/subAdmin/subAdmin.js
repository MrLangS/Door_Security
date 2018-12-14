var app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subAdmin: {},
    phoneNumber: '',
    disabled: false,
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    bcgImg: '/images/bcgimg.jpg',
  },
  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },

  getPhoneValue: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
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
      var subAdmin = this.data.subAdmin
      console.log(phoneNumber)
      console.log(subAdmin.phone)
      if (phoneNumber == subAdmin.phone){
        wx.request({
          url: getApp().globalData.server + '/UserAction!saveSubAdmin.do',
          data: {
            wxOpenId: getApp().globalData.openid,
            unitName: subAdmin.companyName,
            clientId: parseInt(subAdmin.companyId),
            username: subAdmin.name,
            phoneNum: subAdmin.phone,
            userPicId: subAdmin.picId,
          },
          method: 'post',
          success: function (res) {
            console.log(res)
            app.globalData.sysWXUser = res.data.sysWXUser
            app.globalData.isMajorUser = res.data.isMajorUser
            app.globalData.admin = res.data.admin
            wx.switchTab({
              url: '../device/device',
            })
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
      backgroundColor: '#262022',
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
    util.login(subAdmin)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})