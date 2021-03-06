var app = getApp()
var util = require("../../utils/util.js")
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
    avatar: '',
    quality: 1,
    picId: 0,
  },
  gotoSet: function(){
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  navigate2perList: function(){
    wx.navigateTo({
      url: '../perRegister/perList/perList',
    })
  },

  onLoad: function (options) {
    var that = this
    that.setData({
      user: app.globalData.sysWXUser || '',
      admin: app.globalData.admin || '',
      isMajorUser: app.globalData.isMajorUser
    })

  },

  chooseImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do"
        var tempFilePaths = res.tempFilePaths
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                personPhoto: res.data,
                openId: app.globalData.sysWXUser.wxOpenid
              },
              success: (res) => {
                console.log('上传图片请求结果：')
                console.log(res)
                var user=that.data.user
                if (res.data.quality == 0) {
                  user.photoURL = res.data.photoURL,
                  that.setData({
                    user
                  })
                } else {
                  wx.showToast({
                    title: '上传失败,图片须为本人清晰头像',
                    icon: 'none',
                    duration: 1500,
                  })
                }
              },
              fail: (res) => {
                wx.showToast({
                  title: '网络开小差，请稍后再试',
                  icon: 'none',
                  duration: 1500
                })
              },
              complete: (res) => {

              }
            })
          }
        })
      },
    })
  },

  jump2visit: function(){
    wx.navigateToMiniProgram({
      appId: 'wx823d48bf0deffed9',
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

  onShow: function () {
    var that = this

    if (!app.globalData.sysWXUser.photoURL) {
      wx.showModal({
        title: '温馨提示',
        content: '点击默认头像上传人脸照片',
        showCancel: false
      })
    }
    
    util.redotListener()
    
    wx.request({
      url: app.globalData.server + '/ClientInfoAction!getById.do?id=' + app.globalData.admin.clientId,
      method: 'post',
      success: function (res) {
        that.setData({
          company: res.data
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
    }, 300);
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

})