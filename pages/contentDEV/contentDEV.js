var util = require("../../utils/util.js")
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr: [],
    currentVolume: 0,
    volumeTip: true,
    netStatus: true,//网络状态
    autoStatus: true,
    doorStatus: true,
    isModify: false,
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
    var data=this.data.dataArr
    console.log(data)
    wx.request({
      url: app.globalData.server +'/DeviceInfoAction!saveDoorDevParameter.do',
      data:[
        { devId: data[1], id: data[3][0].id, key: data[3][0].key, keyValue: that.data.currentVolume}],
      method: 'post',
      success: (res)=>{
        console.log(res)
      }
    })
  },
  //语音提示设置
  switchChange: function(e){
    var that=this
    var data = this.data.dataArr
    this.setData({
      volumeTip: e.detail.value
    })
    wx.request({
      url: app.globalData.server + '/DeviceInfoAction!saveDoorDevParameter.do',
      data: [
        { devId: data[1], id: data[3][1].id, key: data[3][1].key, keyValue: that.data.volumeTip? 0 : 1 }],
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
  //列表项操作
  navigateItem: function (e) {
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
      // var arr = util.JsonToArray(JSON.parse(options.data))
      var arr = [json.devName, json.devId, json.devAddr, json.deviceParameters, json.devStatus, json.doorStatus, json.id]
      this.setData({
        dataArr: arr,
        currentVolume: arr[3][0].keyValue,
        volumeTip: arr[3][1].keyValue == 0 ? true : false,
        autoStatus: arr[5]=='03'?true:false,
        netStatus: arr[4]=='01'?true:false
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