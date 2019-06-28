var util = require("../../utils/util.js")
var app=getApp()
var pre_checkedDev = []
var pre_checkedId = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peo:{},
    dataArr:[],
    devices: [],
    pre_devices: [],
    isModify: false,
    permisDEV:[],
    choosedDEV: [],
    checkedDev: [],
    checkedId: [],
    choosedId: [],
    hiddenmodal: true,
  },

  chooseDev: function () {
    var that = this
    this.setData({
      hiddenmodal: false
    })
    this.setData({
      pre_devices: this.data.devices
    })
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
    wx.request({
      url: getApp().globalData.server + '/TransitPerson/updatePersonFromWx.do',
      data: {
        personId: this.data.peo.person.id + '',
        personName: this.data.dataArr[1],
        phoneNo: this.data.dataArr[2],
        duty: this.data.dataArr[3],
        email: this.data.dataArr[4],
        devices: this.data.choosedId
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
      var item = value[i]
      var itemId = value[i].devId
      checkedDev.push(item)
      checkedId.push(itemId)
    }
    this.setData({
      checkedDev: checkedDev,
      checkedId: checkedId
    })
  },
  chooseImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/TransitPerson/uploadPhotoFromWx.do"
        var tempFilePaths = res.tempFilePaths
        var dataArr = that.data.dataArr
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调

            console.log(res)
            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                personPhoto: res.data,
                personId: that.data.peo.person.id
              },
              success: (res) => {
                if (res.data.msg == 'ok') {
                  dataArr[0] = res.data.photoURL
                  that.setData({
                    dataArr: dataArr
                  })
                } else {
                  wx.showToast({
                    title: '上传失败,图片须为本人清晰头像',
                    icon: 'none',
                    duration: 1500
                  })
                }
              },
              fail: (res) => {
                wx.showToast({
                  title: '网络开小差，请稍后再试',
                  icon: 'none',
                  duration: 1500
                })
              }
            })
          }
        })
      },
    })
  },
  preview: function () {
    var that = this
    var imgURL = this.data.dataArr[0]
    wx.getImageInfo({
      src: imgURL,
      success: (res) => {
        console.log(res)
        wx.previewImage({
          current: res.path,
          urls: [res.path],
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
    if (typeof (options.data) != "undefined") {
      var json = JSON.parse(options.data)
      var arr = [json.person.photoURL, json.person.personName, json.person.phoneNo,json.person.duty,json.person.email]
      this.setData({
        peo: json,
        dataArr: arr
      })
    }
    var permission = this.data.peo.permission
    //获取所有设备信息
    wx.request({
      url: app.globalData.server + '/DoorDevice/getClientDevices.do?clientId=' + app.globalData.admin.clientId,
      method: 'post',
      success: (res) => {
        let devices = res.data.map(function (e) {
          if (permission.indexOf(e.devId) >= 0) {
            e.checked = true
          }

          return e
        })
        this.setData({
          devices: devices
        })
        var permisDEV = this.data.devices.filter((item) => { return permission.indexOf(item.devId) >= 0 })

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
    if (this.data.isModify) {
      console.log('duty:' + this.data.dataArr[3])
      console.log('email:' + this.data.dataArr[4])
      wx.request({
        url: getApp().globalData.server + '/TransitPerson/updatePersonFromWx.do',
        data: {
          personId: this.data.peo.person.id+'',
          personName: this.data.dataArr[1],
          phoneNo: this.data.dataArr[2],
          duty: this.data.dataArr[3],
          email: this.data.dataArr[4],
          devices: this.data.peo.permission
        },
        method: 'post',
        success: function (res) {
          console.log(res)
        }
      })
    }
  },

  onHide: function () {

  },
})