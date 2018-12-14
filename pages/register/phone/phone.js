// pages/register/phone/phone.js
var util=require("../../../utils/util.js")
var app = getApp()
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
    bcgImg: '/images/bcgimg.jpg',
    modal: true,
    modalTo: true,
    list: [],
    staffId: 0,
    values: '',
  },
  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      staffId: e.detail.value
    })
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
      //获取用户
      wx.request({
        url: getApp().globalData.server + '/SysWXUserAction/recoverUser.do',
        data: {
          userId: parseInt(that.data.staffId),
          openId: app.globalData.openid
        },
        method:'post',
        success: (res)=>{
          console.log(res)
          if(res.data.msg=='ok'){
            util.login()
          }
        }
      })
    }
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
    var that=this
    let values = e.detail.value
    let phoneNumber = values.phoneNumber || ''
    let code = values.code || ''
    if (util.checkForm(this,0)){
      var userId=0
      wx.request({
        url: getApp().globalData.server + '/SysWXUserAction/checkAdminIsExist.do?phoneNum=' + phoneNumber,
        method: 'post',
        success: (res)=>{
          console.log(res)
          var memberList=res.data
          if (typeof (memberList[0]) != "undefined"){
            this.setData({
              list: memberList,
              modalTo: false
            })
            that.setData({
              values: JSON.stringify(values)
            })
          }else{
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
      backgroundColor: '#262022',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    util.login()
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