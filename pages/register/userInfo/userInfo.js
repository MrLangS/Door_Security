var util = require("../../../utils/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    values:'',
    bcgImg: '/images/bcgimg.jpg',
    avatar: '',
    quality: 1,
    username: '',//姓名
    company: '',
    picId: 0,
    progress: true,
    active: false,
    percent: 0,
    progressColor: '#3281ff',
  },

  progressIsOk: function(){
    console.log('ok')
  },
  commit(e) {
    var that=this
    let values = e.detail.value
    var json={}
    if(util.checkForm(this, 1)) {
      if(this.data.values.length!=0){
        json=JSON.parse(this.data.values)
      }
      json.username = values.username
      json.company = values.company
      json.avatar=this.data.avatar
      json.picId=this.data.picId
      wx.chooseLocation({
        success: function (res) {
          console.log(res)
          json.siteName = res.name
          json.address = res.address
          json.longitude = res.longitude
          json.latitude = res.latitude
          console.log(json)
          wx.request({
            url: getApp().globalData.server + '/ClientInfoAction!registerClient.do',
            data: {
              wxOpenId: wx.getStorageSync('openid'),
              clientName: json.company,
              siteName: json.siteName,
              address: json.address,
              longitude: json.longitude+'',
              latitude: json.latitude+'',
              username: json.username,
              phoneNum: json.phoneNumber,
              // userPhotoURL: json.avatar,
              userPicId: json.picId,
              clientLogoURL: ''
            },
            header: {},
            method: 'post',
            dataType: 'json',
            success: function(res) {
              console.log(res)
              app.globalData.sysWXUser = res.data.sysWXUser
              app.globalData.admin = res.data.admin
              app.globalData.isMajorUser = true
              wx.redirectTo({
                url: '../result/result',
              })
            },
            fail: function(res) {},
          })
        },
      })
    }
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
  chooseImg: function(){
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
              success: (res)=>{
                console.log('上传图片请求结果：')
                console.log(res)
                if(res.data.msg=='ok'){
                  that.setData({
                    avatar: res.data.photoURL,
                    picId: res.data.picId,
                    quality: 0,
                  })
                }else{
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
              fail: (res)=>{
                wx.showToast({
                  title: '网络开小差，请稍后再试',
                  icon: 'none',
                  duration: 1500
                })
              },
              complete: (res)=>{
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置导航栏背景色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#262022',
      animation: {
        duration: 50,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      values: options.data||''
    })
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