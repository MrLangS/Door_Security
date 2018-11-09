var app = getApp()
Page({

  data: {
    bcgImg: '/images/bcgimg.jpg',
    devName:'',
    address:'',
    serialnum: '',
    hidden: true,
    array: ['WPA-PSK', 'WPA2-PSK','WEP'],
    index: 0,
    disabled: false,
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      hidden: !this.data.hidden
    })
  },

  commit(e) {
    var that=this
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
    if (values.netType=='1'){
      if (!values.wfName.replace(/\s+/g, '')) {
        wx.showToast({
          title: '请输入wifi名称',
          icon: 'none',
        })
        return
      }
      if (!values.wfPassword.replace(/\s+/g, '')) {
        wx.showToast({
          title: '请输入wifi密码',
          icon: 'none',
        })
        return
      }
      if (values.wfPassword != values.checkPassword){
        wx.showToast({
          title: '密码不一致！请重新输入',
          icon: 'none',
        })
        return
      }
    }

    //二维码数据处理
    var codeJD={
      "devId": values.serialnum,
      "devName": values.name,
      "address": values.address,
      "clientId": app.globalData.admin.clientId,
      "regionId": app.globalData.admin.regionId,
      "netType": values.netType,
    }
    if(values.netType=="1"){
      codeJD.wfName = values.wfName
      codeJD.wfPassword = values.wfPassword
      codeJD.netSecurity = values.netSecurity
    }
    
    if(this.data.disabled){
      wx.reLaunch({
        url: '../qrcode/qrcode?data=' + JSON.stringify(codeJD),
      })
    }else{
      wx.request({
        url: app.globalData.server + '/DoorDevice/registerDevice.do',
        data: {
          devId: values.serialnum,
          devName: values.name,
          address: values.address,
          clientId: app.globalData.admin.clientId,
          regionId: app.globalData.admin.regionId
        },
        method: 'post',
        success: function (res) {
          console.log(res)
          if (res.data == "SUCCESS") {
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1];   //当前页面
            var prevPage = pages[pages.length - 2];  //上一个页面
            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            var index = that.data.index
            prevPage.setData({
              isAdd: true
            })
            wx.reLaunch({
              url: '../qrcode/qrcode?data=' + JSON.stringify(codeJD),
            })
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1500,
            })
          } else {
            wx.showToast({
              title: '已添加该设备！不能再次添加',
              icon: 'none',
              duration: 1500,
            })
          }

        },
        fail: function (res) {
          wx.showToast({
            title: '网路开小差，请稍后再试',
            icon: 'none',
            duration: 1500,
          })
        }
      }) 
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置导航栏背景色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#262022',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    if(typeof(options.data)!="undefined"){
      var json = JSON.parse(options.data) 
      this.setData({
        serialnum: json.deviceId||json.devId||'',
        devName: json.devName||'',
        address: json.devAddr || ''
      })
    }
    if (typeof (options.tag) != "undefined"){
      this.setData({
        disabled: true
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