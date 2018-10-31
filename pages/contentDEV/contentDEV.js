var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr: [],
    currentVolume: 50,
    volumeTip: true,
    netStatus: true,//网络状态
  },

  //设备音量设置
  volumeBindChanging: function(e){
    console.log(e.detail.value)
    this.setData({
      currentVolume: e.detail.value
    })
  },
  volumeBindChange: function(e){
    console.log("一次拖动完成!")
  },
  //语音提示设置
  switchChange: function(e){
    console.log(e)
    this.setData({
      volumeTip: e.detail.value
    })
  },
  //列表项操作
  navigateItem: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (typeof (options.data) != "undefined") {
      var arr = util.JsonToArray(JSON.parse(options.data))
      arr.pop()
      this.setData({
        dataArr: arr
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