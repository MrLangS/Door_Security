var util = require("../../utils/util.js")
var pre_checkedDev = []
var pre_checkedId = []
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyId: 0,
    companyName: '',
    devices: [],
    pre_devices: [],
    avatar: '',
    hiddenmodal: true,
    choosedDEV: [],
    checkedDev: [],
    checkedId: [],
    choosedId: [],
  },
  chooseDev: function(){
    var that=this
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
    var checkedId=[]
    for (var i = 0; i < value.length; i++) {
      var item = value[i].devName
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

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  commit: function (e) {
    let values = e.detail.value
    let name = values.name || ''
    let phone = values.phone || ''
    if (util.checkStaffForm(this,name,phone)){
      console.log(values)
      console.log(this.data.choosedId)
      wx.request({
        url: app.globalData.server +'/TransitPerson/addPersonFromWx.do',
        data: {
          person:{
            personName: name,
            phoneNo: phone,
            clientId: this.data.companyId,
            personCompany: this.data.companyName,
            photo: this.data.avatar
          },
          devices:this.data.choosedId
        },
        method: 'post',
        success: (res)=>{
          console.log(res)
          if(res.data=="SUCCESS"){
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            prevPage.setData({
              isAdd: true,
            })
            wx.navigateBack()
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000,
            })
          }else{
            wx.showToast({
              title: '添加失败，请稍后重试',
              icon: 'none',
              duration: 1000,
            })
          }
        }
      })
    }  
  },

  chooseImg: function(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do"
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length > 0) {
          wx.uploadFile({
            url: uploadUserUrl,
            filePath: tempFilePaths[0],
            name: 'personPhoto',
            header: { "Content-Type": "multipart/form-data" },
            success: function (res) {
              console.log('上传图片请求...')
              var data = JSON.parse(res.data)
              console.log(res)
              if (data.quality==0) {
                that.setData({
                  avatar: data.photoURL
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.server +'/DoorDevice/getClientDevices.do?clientId='+app.globalData.admin.clientId,
      method: 'post',
      success: (res)=>{
        console.log(res)
        this.setData({
          devices: res.data
        })
      }
    })
    if(typeof(options.id)!="undefined"){
      console.log("公司id为"+options.id)
      this.setData({
        companyId: options.id,
        companyName: options.name
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