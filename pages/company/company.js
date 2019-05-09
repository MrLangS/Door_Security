var app = getApp()
var util = require("../../utils/util.js")

Page({
  data: {
    companys: [],
    startX: 0, //开始坐标
    startY: 0,
    isMajorUser: true,
    hiddenmodal: true,
    months: [],
    month: '',
    id4excel: 0
  },

  getMonths() {
    var date = new Date()
    var months = []
    for (var i = 0; i < 9; i++) {
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month
      months.push({ val: date.getFullYear() + '-' + month })
      date.setMonth(date.getMonth() - 1);
    }
    this.setData({ months: months })
  },

  //弹出框
  choose: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var id = this.data.companys[index].client.id
    this.setData({
      hiddenmodal: false,
      id4excel: id
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
    });
  },
  //确认生成表格
  confirm: function () {
    this.setData({
      hiddenmodal: true
    })

    wx.request({
      url: app.globalData.server + '/ClockingIn/exportReport.do?unitId=' + this.data.id4excel + '&&searchMonth=' + this.data.month,
      method: 'get',
      success: res => {
        wx.downloadFile({
          url: res.data,
          success(res){
            wx.openDocument({
              filePath: res.tempFilePath,
              success(res){
                console.log('打开文档成功')
                wx.showToast({
                  title: '正在加载...',
                  icon: 'loading',
                  duration: 1000
                })
              },
              fail(res){
                console.log(res)
              }
            })
          }
        })
      }
    })
    
  },

  //多选
  userCheck: function (e) {
    let index = e.currentTarget.dataset.id;//获取用户当前选中的索引值
    let checkBox = this.data.months;

    if (!checkBox[index].checked) {
      for (var one of checkBox) {
        one.checked = false
      }
      checkBox[index].checked = true;
      this.setData({
        months: checkBox,
        month: checkBox[index].val
      })
    }
  },

  bindChange: function(e){
    console.log(e)
    this.setData({
      year: this.data.years[e.detail.value[0]],
      month: this.data.months[e.detail.value[1]]
    })
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
    var id = that.data.companys[index].client.id
    if (app.globalData.admin.clientId == id){
      wx.showToast({
        title: '主单位不能删除!',
        icon: 'none',
        duration: 1500
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '删除单位会一并删除该单位下所有员工，确定删除吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.server + '/ClientInfoAction!deleteClient.do?id=' + id,
              data: {},
              method: 'post',
              success: function (res) {
                console.log(res)
                if (res.data == "SUCCESS") {
                  that.data.companys.splice(index, 1)
                  that.setData({
                    companys: that.data.companys
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
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMonths()

    var that = this;
    var items = that.data.companys
    for (var i = 0; i < items.length; i++) {
      items[i].isTouchMove = false //默认隐藏删除
    }
    that.setData({
      isMajorUser: app.globalData.isMajorUser,
      companys: items
    });
  },

  onShow: function () {
    var that=this
    wx.request({
      url: app.globalData.server + '/ClientInfoAction!getAllSubordinateClient.do?id=' + app.globalData.admin.clientId,
      data: { id: app.globalData.admin.clientId},
      method: 'post',
      success: function(res){
        that.setData({
          companys: res.data
        })
      }
    })

    util.redotListener()
    
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})