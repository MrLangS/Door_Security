var util = require("../../utils/util.js")
var pre_checkedDev = []
var pre_checkedId = []
var app = getApp()
Page({

  data: {
    companyId: 0,
    img: '',
    name: '',
    devices: [],
    pre_devices: [],
    hiddenmodal: true,
    choosedDEV: [],
    checkedDev: [],
    checkedId: [],
    choosedId: [],
    isMajorUser: true,
  },

  chooseDev: function () {
    var that = this
    this.setData({
      hiddenmodal: false
    })
    this.setData({
      pre_devices: this.data.devices
    })
    console.log("记录进入前的设备列表:")
    console.log(this.data.pre_devices)
    pre_checkedDev = [].concat(this.data.checkedDev)
    pre_checkedId = [].concat(this.data.checkedId)
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
      devices: this.data.pre_devices,
      checkedDev: pre_checkedDev,
      checkedId: pre_checkedId
    });
  },
  confirm: function () {
    this.setData({
      hiddenmodal: true,
      choosedDEV: this.data.checkedDev,
      choosedId: this.data.checkedId
    })
    console.log(this.data.checkedDev)
    wx.request({
      url: getApp().globalData.server + '/ClientInfoAction!setDevicePermission.do',
      data: {
        clientId: parseInt(this.data.companyId),
        devIds: this.data.choosedId
      },
      method: 'post',
      success: function (res) {
        console.log(res)
      }
    })
  },
  //多选
  userCheck: function (e) {
    let index = e.currentTarget.dataset.id;//获取用户当前选中的索引值
    let checkBox = this.data.devices;
    if (checkBox[index].checked) {
      this.data.devices[index].checked = false;
    } else {
      this.data.devices[index].checked = true;
    }
    this.setData({ devices: this.data.devices })

    //返回用户选中的值
    let value = checkBox.filter((item, index) => {
      return item.checked == true;
    })
    var checkedDev = []
    var checkedId = []
    for (var i = 0; i < value.length; i++) {
      var item = value[i].devName
      var itemId = value[i].devId
      checkedDev.push(value[i])
      checkedId.push(itemId)
    }
    this.setData({
      checkedDev: checkedDev,
      checkedId: checkedId
    })
    console.log(this.data.checkedDev)
    console.log("选择进行时的设备列表:")
    console.log(this.data.devices)
    console.log("选择进行时的过去设备列表:")
    console.log(this.data.pre_devices)
  },

  onLoad: function (options) {
    var devs=options.devs.split(',')
    this.setData({
      isMajorUser: app.globalData.isMajorUser,
      companyId: options.id,
      img: options.img,
      name: options.name
    })
    //获取所有设备信息
    wx.request({
      url: app.globalData.server + '/DoorDevice/getClientDevices.do?clientId=' + app.globalData.admin.clientId,
      method: 'post',
      success: (res) => {
        console.log(res)
        this.setData({
          devices: res.data
        })
        var permisDEV = this.data.devices.filter((item) => { return devs.indexOf(item.devId) >= 0 })
        console.log('删选后的数组')
        console.log(permisDEV)
        var choosedId = []
        for (var i = 0; i < permisDEV.length; i++) {
          var itemId = permisDEV[i].devId
          choosedId.push(itemId)
        }
        this.setData({
          choosedDEV: permisDEV,
          choosedId: choosedId,
          checkedId: choosedId
        })
      }
    })
  },

  onShow: function () {

  },

  onUnload: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      devs: this.data.choosedId
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})