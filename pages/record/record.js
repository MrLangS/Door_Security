var timeoutID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [
      { img:'', deviceName: '设备名称1', peopleName: '人员名称1', time: '2018-09-12 08:00',role: '管理人员'},
      { img: '', deviceName: '设备名称2', peopleName: '人员名称2', time: '2018-09-12 08:00', role: '普通人员' },
      { img: '', deviceName: '设备名称1', peopleName: '人员名称1', time: '2018-09-12 08:00', role: '管理人员' },
      { img: '', deviceName: '设备名称1', peopleName: '人员名称1', time: '2018-09-12 08:00', role: '普通人员' },
      { img: '', deviceName: '设备名称1', peopleName: '人员名称1', time: '2018-09-12 08:00', role: '管理人员' },
      { img: '', deviceName: '设备名称1', peopleName: '人员名称1', time: '2018-09-12 08:00', role: '管理人员' },
      { img: '', deviceName: '设备名称1', peopleName: '人员名称1', time: '2018-09-12 08:00', role: '管理人员' },
      { img: '', deviceName: '设备名称1', peopleName: '人员名称1', time: '2018-09-12 08:00', role: '管理人员' },
      { img: '', deviceName: '设备名称2', peopleName: '人员名称2', time: '2018-09-12 08:00', role: '普通人员' }],
    hideSearch: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  search: function(){
    wx.navigateTo({
      url: '/pages/searchRes/searchRes?tag=' + 1,
    })
  },
  //页面滚动监听
  onPageScroll: function (e) {
    if (typeof (timeoutID)!="undefined"){
      clearTimeout(timeoutID)
    }
    var that=this
    // console.log(e);
    that.setData({
      hideSearch: false
    })
    timeoutID=setTimeout(function(){
      that.setData({
        hideSearch: true
      })
    },2000)
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