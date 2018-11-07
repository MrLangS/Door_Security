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
    console.log('hello')
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
    wx.request({
      url: getApp().globalData.server + '/TransitPerson/updatePersonFromWx.do',
      data: {
        personId: this.data.peo.person.id + '',
        personName: this.data.dataArr[1],
        phoneNo: this.data.dataArr[2],
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
    console.log(this.data.checkedDev)
    console.log("选择进行时的设备列表:")
    console.log(this.data.devices)
    console.log("选择进行时的过去设备列表:")
    console.log(this.data.pre_devices)
  },
  chooseImg: function () {
    var that = this
    console.log(that.data.peo.person.picId)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do?photoId=" + that.data.peo.person.picId
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length > 0) {
          var dataArr=that.data.dataArr
          wx.uploadFile({
            url: uploadUserUrl,
            filePath: tempFilePaths[0],
            name: 'personPhoto',
            data: { photoId: that.data.peo.person.picId},
            header: { "Content-Type": "multipart/form-data" },
            success: function (res) {
              console.log('上传图片请求...')
              var data = JSON.parse(res.data)
              console.log(res)
              dataArr[0] = data.photoURL
              if (data.quality == 0) {
                that.setData({
                  dataArr: dataArr
                })
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1500
                })
              } else {
                wx.showToast({
                  title: '上传失败,图片须为本人清晰头像!',
                  icon: 'none',
                  duration: 1500
                })
              }
            },
            fail: function (res) {
              console.log('上传失败...')
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
          })
        }

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
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.data)
    if (typeof (options.data)!="undefined"){
      var json = JSON.parse(options.data)
      var arr = [json.person.photoURL, json.person.personName, json.person.phoneNo]
      this.setData({
        peo: json,
        dataArr: arr
      })
    }
    //获取所有设备信息
    wx.request({
      url: app.globalData.server + '/DoorDevice/getClientDevices.do?clientId=' + app.globalData.admin.clientId,
      method: 'post',
      success: (res) => {
        console.log(res)
        this.setData({
          devices: res.data
        })
        var permisDEV = this.data.devices.filter((item) => { return this.data.peo.permission.indexOf(item.devId) >= 0 })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isModify) {
      console.log('保存人员修改信息')
      wx.request({
        url: getApp().globalData.server + '/TransitPerson/updatePersonFromWx.do',
        data: {
          personId: this.data.peo.person.id+'',
          personName: this.data.dataArr[1],
          phoneNo: this.data.dataArr[2],
          devices: this.data.peo.permission
        },
        method: 'post',
        success: function (res) {
          console.log(res)
        }
      })
    }
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