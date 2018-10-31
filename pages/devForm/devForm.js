// pages/devForm/devForm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bcgImg: '/images/bcgimg.jpg',
  },

  commit(e) {
    let values = e.detail.value
    console.log(e.detail.value)
    let name=values.name||''
    let address=values.address||''
    if (!name.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入设备名称',
        icon: 'none',
      })
      return
    }
    if (!address.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
      })
      return
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    var index = this.data.index
    prevPage.data.devices.unshift(values)
    prevPage.setData({
      devices: prevPage.data.devices
    })
    wx.navigateBack()
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(typeof(options.data)!="undefined"){
      this.setData({
        serialnum: options.data
      })
    }
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