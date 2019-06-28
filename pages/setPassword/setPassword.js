var app = getApp()
Page({

  data: {
    focus: false,
    index: 0,
    checkPassword: '',
    newPassword: ''
  },

  focus: function(e){
    this.setData({
      focus: true,
      index: e.currentTarget.dataset.index
    })
  },

  blur: function(){
    this.setData({
      focus: false,
    })
  },
  getPassword: function (e){
    this.setData({
      newPassword: e.detail.value
    })
  },
  getChPassword: function (e) {
    this.setData({
      checkPassword: e.detail.value
    })
  },
  confirm: function(e){
    var that = this
    var pattern = /^[0-9]{6}$/
    var newPassword = this.data.newPassword
    var param = this.data.param
    if (!pattern.test(newPassword)){
      wx.showToast({
        title: '密码需为6位数字',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if(newPassword!=this.data.checkPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 1000
      })
      return
    }
    
    wx.request({
      url: app.globalData.server + '/DeviceInfoAction!saveDoorDevParameter.do',
      data: [
        { devId: this.data.devId, id: param.throughPW.id, key: param.throughPW.key, keyValue: newPassword }],
      method: 'post',
      success: (res) => {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          password: newPassword,
        })
        wx.navigateBack()
        wx.showToast({
          title: '密码修改成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },


  onLoad: function (options) {
    if(options.devId) {
      this.setData({
        devId: options.devId,
      })
    }
    if (options.param) {
      var param = JSON.parse(options.param)
      this.setData({
        param: param,
        oldPW: param.throughPW.keyValue
      })
    }
  },
})