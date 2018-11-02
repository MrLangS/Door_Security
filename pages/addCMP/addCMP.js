var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: '',
  },
  //上传公司图片
  chooseImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/ClientInfoAction!uploadPhoto.do"
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length > 0) {
          wx.uploadFile({
            url: uploadUserUrl,
            filePath: tempFilePaths[0],
            name: 'logoPhoto',
            header: { "Content-Type": "multipart/form-data" },
            success: function (res) {
              console.log('上传图片请求...')
              var data = JSON.parse(res.data)
              console.log(data)
              if (typeof(data.photoURL)!="undefined") {
                that.setData({
                  photo: data.photoURL,
                })
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1500
                })
              } else {
                wx.showToast({
                  title: '上传失败,请重试!',
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
  commit:function(e){
    var that=this
    let values = e.detail.value
    let cmpname = values.cmpname || ''
    let address = values.address || ''
    if (!cmpname.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none',
      })
      return
    }
    if (!values.address.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
      })
      return
    }
    console.log(values)
    wx.request({
      url: app.globalData.server + '/ClientInfoAction!addCompany.do',
      data:{
        name: values.cmpname,
        addr: values.address,
        clientLogoURL: that.data.photo,
        superiorClientId: app.admin.clientId
      },
      method: 'post',
      success: function(res){
        console.log(res)
        if(res.data=="SUCCESS"){
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500
          })
          wx.switchTab({
            url: '../company/company',
          })
        }else{
          wx.showToast({
            title: '添加失败，请重试',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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