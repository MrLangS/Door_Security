var md5Utils = require("../../utils/md5.js")
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
    bcgImg: '/images/001.jpg',
    devName: '',
    address: '',
    deviceData: {},
    disabled: false
  },

  commit(e) {
    var that=this
    let values = e.detail.value
    let name=values.name||''
    let address=values.address||''
    let deviceData = this.data.deviceData
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
    this.setData({
      disabled: true
    })
    //添加设备所需传输参数
    let device = {
      'clientId': app.globalData.admin.clientId,
      'devAddr': address,
      'devId': deviceData.devId,
      'devIP': deviceData.devIp,
      'devModel': deviceData.devModel,
      'devName': name,
      'devType': deviceData.devType,
      'regionId': app.globalData.admin.regionId,
      'swVersion': deviceData.swVersion
    }

    let data = { 'device': device, 'licence': deviceData.licence}
    var token = md5Utils.md5(JSON.stringify(data) + app.globalData.key)

    wx.request({
      url: app.globalData.server+'/DoorDevice/autoUploadDevice.do',
      data: {
        device: device,
        licence: deviceData.licence,
        token: token
      },
      method: 'post',
      success: res => {
        console.log(res)
        wx.showToast({
          title: '设备绑定成功！',
          icon:'success',
          duration: 1500
        })
        wx.switchTab({
          url: '../device/device',
        })
      },
      fail: res => {
        console.log(res)
      }
    })
    
  },

  clearName: function(){
    this.setData({
      devName: ''
    })
  },

  clearAddress: function () {
    this.setData({
      address: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('获取到的二维码信息')
    console.log(options.data)
    let data = JSON.parse(options.data)
    wx.request({
      url: app.globalData.server + '/ClientInfoAction!getById.do?id=' + app.globalData.admin.clientId,
      method: 'post',
      success: function (res) {
        that.setData({
          address: res.data.addr || '未知地址'
        })
      }
    })
    var randomString ='默认-' + Math.random().toString(36).slice(-8)
    this.setData({
      deviceData: data,
      devName: randomString
    })
    var that=this
    //设置导航栏背景色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0e122b',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })

    /*var formCache = wx.getStorageSync('formCache')
    console.log(typeof (formCache))
    if (typeof (formCache.wifiName)!='undefined'){
      console.log('表单缓存数据：')
      console.log(formCache)
      that.setData({
        wifiName: formCache.wifiName||'',
        index: formCache.netSecurity,
        netType: formCache.netType,
        password: formCache.wfPassword||''
      })
    }
    */
  },

  onShow: function () {

  },

  scancode: function () {
    var that = this
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
        that.setData({
          activationCode: res.result
        })
      }
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var netType = ''
    if (this.data.netType == '0') {
      netType = '1'
    } else {
      netType = '0'
    }
    this.setData({
      netType: netType
    })
  },

  wifiradioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      wifiName: e.detail.value
    })
  },
  showModal: function () {
    var that = this
    // if(that.data.platform=='ios'){
    wx.startWifi({
      success: (res) => {
        console.log(res)
        if (res.errMsg == 'startWifi:ok') {
          wx.showToast({
            title: '自动填充当前连接wifi名',
            icon: 'none',
            duration: 1500,
          })
        }
      }
    })
    wx.getConnectedWifi({
      success: (res) => {
        console.log(res)
        that.setData({
          wifiName: res.wifi.SSID
        })
      }
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
  insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start);
  },
})