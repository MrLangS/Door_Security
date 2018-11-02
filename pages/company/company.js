var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    companys: [
      // { avatar: '/images/cmpany.png', name: '公司1', address: '地址1' }
    ],
    startX: 0, //开始坐标
    startY: 0
  },

  newCMP:function(){
    wx.navigateTo({
      url: '../addCMP/addCMP',
    })
  },

  navigatItem:function(e){
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../contentCMP/contentCMP?data=' + JSON.stringify(this.data.companys[e.currentTarget.dataset.index]),
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.companys.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      companys: this.data.companys
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
    that.data.companys.forEach(function (v, i) {
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
      companys: that.data.companys
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
    var that=this
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '删除公司会一并删除该公司旗下员工，确定删除吗？',
      success: function(res){
        if(res.confirm){
          console.log(that.data.companys[index].id)
          wx.request({
            url: app.globalData.server + '/ClientInfoAction!deleteClient.do?id=' + that.data.companys[index].id,
            data: {},
            method: 'post',
            success: function (res) {
              console.log(res)
              if(res.data=="SUCCESS"){
                that.data.companys.splice(index, 1)
                that.setData({
                  companys: that.data.companys
                })
                wx.showToast({
                  title: '删除成功!',
                  icon: 'success',
                  duration: 1500
                })
              }else{
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
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var items = that.data.companys
    for (var i = 0; i < items.length; i++) {
      items[i].isTouchMove = false //默认隐藏删除
    }
    that.setData({
      companys: items
    });
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
    var that=this
    wx.request({
      url: app.globalData.server + '/ClientInfoAction!getAllSubordinateClient.do?id=' + app.globalData.admin.clientId,
      data: { id: app.globalData.admin.clientId},
      method: 'post',
      success: function(res){
        console.log(res)
        that.setData({
          companys: res.data
        })
      }
    })
    
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