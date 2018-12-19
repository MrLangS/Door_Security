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
    netType: 0,
    wifiNameList: [],
    wifiName: '',
    disabled: false,
    platform: '',
  },

  scancode: function(){
    var that=this
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
    var netType=''
    if(this.data.netType=='0'){
      netType='1'
    }else{
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
  showModal: function(){
    var that=this
    // if(that.data.platform=='ios'){
      wx.startWifi({
        success: (res) => {
          console.log(res)
          if(res.errMsg=='startWifi:ok'){
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
    // }else{
    //   wx.startWifi({
    //     success: (res) => {
    //       console.log(res)
    //       wx.getWifiList({
    //         success: (res) => {
    //           console.log(res)
    //         }
    //       })
    //     }
    //   })

    //   wx.onGetWifiList(function (CALLBACK) {
    //     var a = CALLBACK.wifiList;
    //     console.log(a)
    //     var obj = new Object()
    //     var arr = []
    //     for (let i in a) {
    //       arr.pushNoRepeat(a[i].SSID)
    //     }
    //     that.setData({
    //       wifiNameList: arr
    //     })
    //     // var array=arr.filter(function(wifiname){return wifiname!=''})
    //     console.log(arr);
    //   })

    //   preWifiName = this.data.wifiName
    //   prewifiNameList = this.data.wifiNameList
    //   this.setData({
    //     modal: !this.data.modal
    //   })
    // }
    
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
          this.setData({
            password: ''
          })
          return
        }
      }  
    }


    //二维码数据处理
    var codeJD={
      "serverIp": getApp().globalData.server,
      "devName": values.name,
      "devAddr": values.address,
      "activationCode": activationCode,
      "clientId": app.globalData.admin.clientId,
      "regionId": app.globalData.admin.regionId,
      "netType": values.netType,
    }
    if(values.netType=="1"){
      codeJD.wfName = values.wfName
      codeJD.wfPassword = values.wfPassword
      codeJD.netSecurity = values.netSecurity
      var formCache = new Object()
      formCache.netType = codeJD.netType
      formCache.wifiName = values.wfName
      formCache.netSecurity = values.netSecurity
      formCache.wfPassword = values.wfPassword
      wx.setStorageSync('formCache', formCache)
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
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          platform: res.platform
        })
      },
    })

    var formCache = wx.getStorageSync('formCache')
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
  },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})