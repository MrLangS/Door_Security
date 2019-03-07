var app = getApp()
Page({
  data: {
    company: {},
    user: {},
    isMajorUser: true,
    isCompanyTouch:false,
    isTouchMove: false,
    startX: 0, //开始坐标
    startY: 0,
    remind: '加载中',
    angle: 0,
    sum: 0,
  },
  navigate2perList: function(){
    wx.navigateTo({
      url: '../perRegister/perList/perList',
    })
    // wx.showTabBarRedDot({
    //   index: 3,
    // })
  },

  jump2visit: function(){
    wx.navigateToMiniProgram({
      appId: 'wxab85b5facf961d5d',
      path: '',
      extraData: {},
      envVersion: 'develop',
      success(res) {
        console.log('跳转到人人访客')
      }
    })
  },

  navigate2strange: function(){
    wx.navigateTo({
      url: '../record/strangeRecord',
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    // this.data.devices.forEach(function (v, i) {
    //   if (v.isTouchMove) //只操作为true的
    //     v.isTouchMove = false;
    // })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      isTouchMove: false,
      isCompanyTouch: false
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var index=e.currentTarget.dataset.index
    var that = this,
    // index = e.currentTarget.dataset.index, //当前索引
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
    //滑动超过30度角 return
    if (Math.abs(angle) < 30){
      if (touchMoveX > startX){
        //右滑
        if(index=='0'){
          that.setData({
            isCompanyTouch: false
          })
        }else{
          that.setData({
            isTouchMove: false
          })
        }
      }else{
        //左滑
        if (index == '0') {
          that.setData({
            isCompanyTouch: true
          })
        } else {
          that.setData({
            isTouchMove: true
          })
        }
      } 
    }
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

  logout: function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定注销吗？',
      success: (res)=>{
        if(res.confirm){
          wx.request({
            url: app.globalData.server + '/SysWXUserAction/logoutUser.do?wxUserId=' + app.globalData.sysWXUser.id +'&type='+3,
            method: 'post',
            success: function (res) {
              console.log(res)
              if (res.data = 'SUCCESS') {
                wx.showToast({
                  title: '注销成功',
                  icon: 'success',
                  duration: 1000,
                })
                wx.reLaunch({
                  url: '../register/phone/phone',
                })
              } else {
                wx.showToast({
                  title: '注销失败',
                  icon: 'none',
                  duration: 1000,
                })
              }
            }
          })
        }
      }
    })
    
  },

  onLoad: function (options) {
    var that=this
    
    that.setData({
      user: app.globalData.sysWXUser||'',
      isMajorUser: app.globalData.isMajorUser
    })

  },


  onShow: function () {
    var that = this
    wx.request({
      url: app.globalData.server + '/ClientInfoAction!getById.do?id=' + app.globalData.admin.clientId,
      method: 'post',
      success: function (res) {
        that.setData({
          company: res.data
        })
      }
    })

    wx.request({
      url: app.globalData.server + '/TransitPerson/getUnauditedPersons.do',
      data: {
        clientId: app.globalData.admin.clientId,
        pageIndex: 0
      },
      method: 'post',
      success: function (res) {
        console.log('审核列表信息:')
        console.log(res)
        that.setData({
          sum: res.data.totalCount
        })
      }
    })
  },

  onReady: function(){
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function () {

  }
})