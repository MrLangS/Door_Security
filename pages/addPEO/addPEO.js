// pages/addPEO/addPEO.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  commit: function (e) {
    let values = e.detail.value
    let name = values.name || ''
    let phone = values.phone || ''
    if (!name.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入人员名称',
        icon: 'none',
      })
      return
    }
    if (!phone.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入该人员手机号',
        icon: 'none',
      })
      return
    }
    console.log(values)
    wx.navigateBack()
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