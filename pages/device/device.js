var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devices: [],
    startX: 0, //开始坐标
    startY: 0,
    data:{},
    isAdd: false,
    isMajorUser: true,
  },

  newDEV: function(){
    var that=this
    wx.navigateTo({
      url: '../devForm/devForm',
    })
  },

  configDevice: function(e){
    // wx.showToast({
    //   title: '正在完善，后续版本即可使用',
    //   icon: 'none',
    //   duration: 1500,
    // })
    this.initBlue()
  },

  /**
   * 初始化蓝牙设备
   */
  initBlue: function () {
    var that = this;
    wx.navigateTo({
      url: '../connectedBlueTooth/connectedBlueTooth',
    })
    // wx.openBluetoothAdapter({//调用微信小程序api 打开蓝牙适配器接口
    //   success: function (res) {
    //     // console.log(res)
    //     wx.showToast({
    //       title: '初始化成功',
    //       icon: 'success',
    //       duration: 800
    //     })
        
    //     //that.findBlue();//2.0
    //   },
    //   fail: function (res) {//如果手机上的蓝牙没有打开，可以提醒用户
    //     wx.showToast({
    //       title: '请开启蓝牙',
    //       icon: 'none',
    //       duration: 1000
    //     })
    //     wx.navigateTo({
    //       url: '../blueTooth/blueTooth',
    //     })
    //   }
    // })
  },

  navigatItem: function (e) {
    console.log(e.currentTarget.dataset.index)
    // var json = this.data.devices[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '../contentDEV/contentDEV?data=' + JSON.stringify(this.data.devices[e.currentTarget.dataset.index]),
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.devices.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      devices: this.data.devices
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    that.data.devices.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      devices: that.data.devices
    })
  },

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定删除该设备吗？',
      success: function (res) {
        if (res.confirm) {
          if (that.data.devices[index].devStatus == '02'){
            wx.showToast({
              title: '设备在离线状态下不能被删除！',
              icon: 'none',
              duration: 1500,
            })
          }else{
            wx.request({
              url: app.globalData.server + '/DoorDevice/deleteDevice.do?devId=' + that.data.devices[index].devId,
              data: {},
              method: 'post',
              success: function (res) {
                console.log(res)
                if (res.data == "SUCCESS") {
                  that.data.devices.splice(index, 1)
                  that.setData({
                    devices: that.data.devices
                  })
                  wx.showToast({
                    title: '删除成功!',
                    icon: 'success',
                    duration: 1500
                  })
                } else {
                  wx.showToast({
                    title: '删除失败，请稍后再试!',
                    icon: 'none',
                    duration: 1500
                  })
                }
              }
            })
          }
          
        }
      }
    })
  },

  //跳转到二维码数据表单
  code: function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../devForm/devForm?data=' + JSON.stringify(that.data.devices[index])+'&tag=1',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isMajorUser: app.globalData.isMajorUser
    })
  },

  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.server + '/DoorDevice/getClientDevices.do?clientId=' + app.globalData.admin.clientId,
      method: 'post',
      success: (res) => {
        console.log(res)
        that.setData({
          devices: res.data
        })
      }
    })
    var items = that.data.devices
    for (var i = 0; i < items.length; i++) {
      items[i].isTouchMove = false //默认隐藏删除
    }
    that.setData({
      devices: items
    });
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