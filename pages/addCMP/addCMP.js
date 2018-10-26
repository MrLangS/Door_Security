// pages/addCMP/addCMP.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  commit:function(e){
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