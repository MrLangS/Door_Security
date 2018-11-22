var app = getApp()
var preWifiName=''
var prewifiNameList=[]
Array.prototype.pushNoRepeat = function () {
  for (var i = 0; i < arguments.length; i++) {
    var ele = arguments[i];
    if(typeof(ele)!="undefined"&&ele!=''){
      if (this.indexOf(ele) == -1) {
        this.push(ele);
      }
    }
  }
};
Page({

  data: {
    bcgImg: '/images/bcgimg.jpg',
    devName:'',
    address:'',
    serverIp: getApp().globalData.server,
    hidden: true,
    array: ['WPA-PSK', 'WPA2-PSK','WEP','无密码'],
    modal: true,
    index: 0,
    wifiNameList: [],
    wifiName: '',
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

  wifiradioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      wifiName: e.detail.value
    })
  },
  showModal: function(){
    preWifiName=this.data.wifiName
    prewifiNameList=this.data.wifiNameList
    this.setData({
      modal: !this.data.modal
    })
  },
  cancel01: function () {
    this.setData({
      modal: true,
      wifiName: preWifiName,
      wifiNameList: prewifiNameList
    })
  },
  confirm01: function () {
    this.setData({
      modal: true,
    })
    console.log(this.data.wifiNameList)
  },
  //插入字符
  insertStr(soure, start, newStr){
    return soure.slice(0, start) + newStr + soure.slice(start);
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
    var myreg = /[0-9a-zA-Z]{16}/;
    if (!myreg.test(values.activationCode)){
      wx.showToast({
        title: '请输入16位字母或数字组合',
        icon: 'none',
      })
      return
    }
    var insertStr = this.insertStr
    var activationCode = insertStr(insertStr(insertStr(values.activationCode, 4, "-"), 9, "-"), 14, "-")
    console.log(activationCode)
    if (values.netType=='1'){
      if (!values.wfName.replace(/\s+/g, '')) {
        wx.showToast({
          title: '请输入wifi名称',
          icon: 'none',
        })
        return
      }
      if(!this.data.index==3){
        if (!values.wfPassword.replace(/\s+/g, '')) {
          wx.showToast({
            title: '请输入wifi密码',
            icon: 'none',
          })
          return
        }
        if (values.wfPassword != values.checkPassword) {
          wx.showToast({
            title: '密码不一致！请重新输入',
            icon: 'none',
          })
          return
        }
      }  
    }


    //二维码数据处理
    var codeJD={
      "serverIp": getApp().globalData.server,
      "devName": values.name,
      "address": values.address,
      "activationCode": activationCode,
      "clientId": app.globalData.admin.clientId,
      "regionId": app.globalData.admin.regionId,
      "netType": values.netType,
    }
    if(values.netType=="1"){
      codeJD.wfName = values.wfName
      codeJD.wfPassword = values.wfPassword
      codeJD.netSecurity = values.netSecurity
    }
  
    wx.reLaunch({
      url: '../qrcode/qrcode?data=' + JSON.stringify(codeJD),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    //设置导航栏背景色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#262022',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    wx.startWifi({
      success: (res)=>{
        console.log(res)
        wx.getWifiList({
        })
      }
    }) 
    wx.onGetWifiList(function (CALLBACK) {
      var a = CALLBACK.wifiList;
      var obj=new Object()
      var arr=[]
      for(let i in a){
        arr.pushNoRepeat(a[i].SSID)
      }
      that.setData({
        wifiNameList: arr
      })
      // var array=arr.filter(function(wifiname){return wifiname!=''})
      console.log(arr);
    })
    // if(typeof(options.data)!="undefined"){
    //   var json = JSON.parse(options.data) 
    //   this.setData({
    //     serialnum: json.deviceId||json.devId||'',
    //     devName: json.devName||'',
    //     address: json.devAddr || ''
    //   })
    // }
    // if (typeof (options.tag) != "undefined"){
    //   this.setData({
    //     disabled: true
    //   })
    // }
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