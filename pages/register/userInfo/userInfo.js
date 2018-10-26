var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    values:'',
    bcgImg: '/images/bcgimg.jpg',
    avatar: '/images/empty_avatar_user.png',
    quality: 1,
    username: '',//姓名
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
      json.avatar=this.data.avatar
      
      wx.chooseLocation({
        success: function (res) {
          console.log(res)
          wx.request({
            url: '',
            data: '',
            header: {},
            method: 'GET',
            dataType: 'json',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
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
  chooseImg: function(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do"
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length > 0) {
          wx.uploadFile({
            url: uploadUserUrl,
            filePath: tempFilePaths[0],
            name: 'personPhoto',
            header: { "Content-Type": "multipart/form-data" },
            success: function (res) {
              console.log('上传图片请求...')
              var data = JSON.parse(res.data)
              console.log(data)
              if (data.quality == 0) {
                that.setData({
                  avatar: data.photoURL,
                  quality: 0,
                })
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1500
                })
              } else {
                wx.showToast({
                  title: '图片不合格',
                  icon: 'loading',
                  duration: 1500
                })
              }
            },
            fail: function (res) {
              console.log('上传失败...')
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
          })
        }

      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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