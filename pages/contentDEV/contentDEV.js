var util = require("../../utils/util.js")
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr: [],
    currentVolume: 0,
    radarStatus: true,
    nameStatus: true,
    netStatus: true,//网络状态
    autoStatus: true,
    doorStatus: true,
    isModify: false,
    isMajorUser: true,
    activeBtn: false,
    voiceArr: ['姓名语音','验证语音','滴声'],
    voiceIdx: 0,
  },

  //人名显示控制
  switchName: function(e){
    var that = this
    var data = that.data.dataArr
    var param = that.data.param
    this.setData({
      nameStatus: e.detail.value
    })
    wx.request({
      url: app.globalData.server + '/DeviceInfoAction!saveDoorDevParameter.do',
      data: [
        { devId: data[1], id: param.isHintName.id, key: param.isHintName.key, keyValue: that.data.nameStatus ? '1' : '0' }],
      method: 'post',
      success: (res) => {

      }
    })
  },

  // 活体检测
  switchChange: function(e){
    var that = this
    var data = that.data.dataArr
    var param = that.data.param
    this.setData({
      alive: e.detail.value,
      distanceIdx: 1
    })
    wx.request({
      url: app.globalData.server + '/DeviceInfoAction!saveDoorDevParameter.do',
      data: [
        { devId: data[1], id: param.livenessType.id, key: param.livenessType.key, keyValue: that.data.alive? '2' : '1' }],
      method: 'post',
      success: (res) => {
      }
    })
  },

  // 二维码显示控制
  switchCode: function (e) {
    var that = this
    var data = that.data.dataArr
    var param = that.data.param
    this.setData({
      showCode: e.detail.value
    })
    wx.request({
      url: app.globalData.server + '/DeviceInfoAction!saveDoorDevParameter.do',
      data: [
        { devId: data[1], id: param.isShowQR.id, key: param.isShowQR.key, keyValue: that.data.showCode ? '1' : '0' }],
      method: 'post',
      success: (res) => {
      }
    })
  },

  //重启
  restart: function(){
    var that = this
    that.setData({
      reStartBtn: true
    })
    wx.showModal({
      title: '提示',
      content: '确定要重启该设备吗？',
      success: res => {
        if(res.confirm) {
          wx.request({
            url: app.globalData.server + '/DoorDevice/reboot.do?devId=' + this.data.dataArr[1],
            method: 'post',
            success: (res) => {
              if (res.data == 'SUCCESS') {
                wx.showToast({
                  title: '已通知设备重启',
                  icon: 'none',
                  duration: 1000,
                })
              } else {
                wx.showToast({
                  title: '出现故障',
                  icon: 'none',
                  duration: 500,
                })
              }
            }
          })
        }
      }
    })
    
    setTimeout(function () {
      that.setData({
        reStartBtn: false
      })
    }, 500)
  },

  //开门按钮点击事件
  activeBtn: function(e){
    var that=this
    that.setData({
      activeBtn:true
    })
    wx.request({
      url: app.globalData.server + '/DoorDevice/openDoor.do?devId=' + this.data.dataArr[1],
      method: 'post',
      success: (res)=>{
        if(res.data=='SUCCESS'){
          wx.showToast({
            title: '正在开启，请耐心等候!',
            icon: 'none',
            duration: 700,
          })
        }else{
          wx.showToast({
            title: '出现故障',
            icon: 'none',
            duration: 500,
          })
        }
      }
    })
    setTimeout( function(){
      that.setData({
        activeBtn: false
      })
    }, 500)
  },

  //人脸识别设置
  detectBindChanging: function (e) {
    this.setData({
      detectDistance: e.detail.value
    })
  },
  detectBindChange: function (e) {
    var that = this
    console.log("一次拖动完成!")
    that.setData({
      detectDistance: e.detail.value
    })
    var data = this.data.dataArr
    var param = that.data.param
    wx.request({
      url: app.globalData.server + '/DeviceInfoAction!saveDoorDevParameter.do',
      data: [
        { devId: data[1], id: param.detectDistance.id, key: param.detectDistance.key, keyValue: that.data.detectDistance }],
      method: 'post',
      success: (res) => {
        console.log(res)
      }
    })
  },

  //设备音量设置
  volumeBindChanging: function(e){
    this.setData({
      currentVolume: e.detail.value
    })
  },
  volumeBindChange: function(e){
    var that=this
    console.log("一次拖动完成!")
    that.setData({
      currentVolume: e.detail.value
    })
    var data=this.data.dataArr
    var param = that.data.param
    wx.request({
      url: app.globalData.server +'/DeviceInfoAction!saveDoorDevParameter.do',
      data:[
        { devId: data[1], id: param.volume.id, key: param.volume.key, keyValue: that.data.currentVolume}],
      method: 'post',
      success: (res)=>{
        console.log(res)
      }
    })
  },
  //语音提示设置
  bindVoicePicker: function(e){
    var that = this
    var data = this.data.dataArr
    var param = that.data.param
    this.setData({
      voiceIdx: e.detail.value
    })
    wx.request({
      url: app.globalData.server + '/DeviceInfoAction!saveDoorDevParameter.do',
      data: [
        { devId: data[1], id: param.voice.id, key: param.voice.key, keyValue: that.data.voiceIdx}],
      method: 'post',
      success: (res) => {
        console.log(res)
      }
    })
  },
  //距离设置
  bindDistancePicker: function (e) {
    var that = this
    var data = this.data.dataArr
    this.setData({
      distanceIdx: e.detail.value
    })
    wx.request({
      url: app.globalData.server + '/DeviceInfoAction!saveDoorDevParameter.do',
      data: [
        { devId: data[1], id: data[3][3].id, key: data[3][3].key, keyValue: that.data.distanceIdx == '0' ? '0.1' : '0.3' }],
      method: 'post',
      success: (res) => {
        console.log(res)
      }
    })
  },

  //自动开门设置
  switchAuto(e){
    this.setData({
      autoStatus: e.detail.value
    })
    if (e.detail.value) {
      wx.request({
        url: app.globalData.server + '/DoorDevice/controlDevice.do?id=' + this.data.dataArr[6] +'&doorStatus=03',
        method: 'post',
        success: (res)=>{
          console.log(res)
        }
      })
    }else{
      var status='00'
      console.log(this.data.doorStatus)
      if(this.data.doorStatus){
        status='01'
      }else{
        status='02'
      }
      wx.request({
        url: app.globalData.server + '/DoorDevice/controlDevice.do?id=' + this.data.dataArr[6] + '&doorStatus='+status,
        method: 'post',
        success: (res) => {
          console.log(res)
        }
      })
    }
  },
  //强制开门设置
  switchDoor(e){
    this.setData({
      doorStatus: e.detail.value
    })
    var status = '00'
    if (this.data.doorStatus) {
      status = '01'
    } else {
      status = '02'
    }
    wx.request({
      url: app.globalData.server + '/DoorDevice/controlDevice.do?id=' + this.data.dataArr[6] + '&doorStatus=' + status,
      method: 'post',
      success: (res) => {
        console.log(res)
      }
    })
  },
  //检查更新
  updateSoft: function(){
    wx.request({
      url: app.globalData.server + '/DoorDevice/updateDeviceSW.do?devId=' + this.data.dataArr[1],
      data:{
        devId: this.data.dataArr[1],
      },
      method: 'post',
      success: (res)=>{
        console.log(res)
        if(res.data=='SUCCESS'){
          wx.showToast({
            title: '已通知设备自动更新',
            icon: 'none',
            duration: 1500,
          })
        }else{
          wx.showToast({
            title: '当前设备软件已是最新版本',
            icon: 'none',
            duration: 1500,
          })
        }
      },
      fail: (res)=>{
        wx.showToast({
          title: '网络开小差，请稍后再试',
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  //列表项操作
  navigateItem: function (e) {
    this.setData({
      isModify: false,
    })
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (typeof (options.data) != "undefined") {
      var json = JSON.parse(options.data)
      console.log(json)

      var arr = [json.devName, json.devId, json.devAddr, json.deviceParameters, json.devStatus, json.doorStatus, json.id, json.swVersion, json.swVersionName]
      var paramArr=json.deviceParameters
      var param={}
      for(var item of paramArr){
        param[item.key] = { "key": item.key,"keyValue" : item.keyValue,"id" : item.id}
      }
      that.setData({
        param: param
      })
      wx.request({
        url: app.globalData.server + '/DoorDevice/isNewestVersion.do?currentVersion=' + arr[7],
        method: 'post',
        success: (res)=>{
          if(res.data == "SUCCESS"){
            wx.showToast({
              title: '发现新版本，可在设置中通知设备更新',
              icon: 'none',
              duration: 1500,
            })
          }
        }
      })

      this.setData({
        isMajorUser: app.globalData.isMajorUser,
        dataArr: arr,
        currentVolume: param.volume.keyValue,
        detectDistance: param.detectDistance.keyValue,
        voiceIdx: param.voice.keyValue,
        alive: param.livenessType.keyValue == '2' ? true : false,
        nameStatus: param.isHintName.keyValue == '1' ? true : false,
        showCode: param.isShowQR.keyValue == '1' ? true : false,
        autoStatus: arr[5] == '03' ? true : false,
        netStatus: arr[4] == '01' ? true : false
      })
      if(!this.data.autoStatus){
        this.setData({
          doorStatus: arr[5] == '01' ? true : false,
        })
      }
      
    }
  },

  onShow: function () {
    if (this.data.isModify) {
      console.log('保存修改信息')
      wx.request({
        url: getApp().globalData.server + '/DoorDevice/updateDeviceMsg.do',
        data: {
          id: this.data.dataArr[6],
          devName: this.data.dataArr[0],
          devAddr: this.data.dataArr[2]
        },
        method: 'post',
        success: function (res) {
          console.log(res)
        }
      })
    }
  },

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