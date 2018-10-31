// pages/searchRes/searchRes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '',
    recordList: [],
    staffList: [],
  },

  bindinput: function(e){
    console.log(e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //tag=1代表查询通行记录；tag=0代表查询人员信息
    if(options.tag==1){
      this.setData({
        placeholder: '查询通行记录',
        recordList: [
          { img: '', deviceName: '设备名称1', peopleName: '人员名称1', time: '2018-09-12 08:00', role: '管理人员' },
          { img: '', deviceName: '设备名称2', peopleName: '人员名称2', time: '2018-09-12 08:00', role: '普通人员' }]
      })
    }
    if (options.tag == 0) {
      this.setData({
        placeholder: '查询人员',
        staffList:[
          { avatar: '/images/empty_avatar_user.png', name: '1号', phone: '18401610488' },
          { avatar: '/images/empty_avatar_user.png', name: '2号', phone: '18401610488' },
          { avatar: '/images/empty_avatar_user.png', name: '3号', phone: '18401610488' }]
      })
    }
    // this.setData({
    //   recordList: [
    //     { img: '', deviceName: '设备名称1', peopleName: '人员名称1', time: '2018-09-12 08:00', role: '管理人员' },
    //     { img: '', deviceName: '设备名称2', peopleName: '人员名称2', time: '2018-09-12 08:00', role: '普通人员' }]
    // })
    // this.setData({
    //   staffList:[
    //     { avatar: '/images/empty_avatar_user.png', name: '1号', phone: '18401610488' },
    //     { avatar: '/images/empty_avatar_user.png', name: '2号', phone: '18401610488' },
    //     { avatar: '/images/empty_avatar_user.png', name: '3号', phone: '18401610488' }
    //   ]
    // })
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