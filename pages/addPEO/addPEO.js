
var pre_checkedDev = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    devices: [
      { name: '设备名称1', serialnum: '0001', address: '所属区域1', param: 50, voicetip: 0, status: '离线' },
      { name: '设备名称2', serialnum: '0002', address: '所属区域2', param: 50, voicetip: 0, status: '在线' }
    ],
    pre_devices: [],
    hiddenmodal: true,
    choosedDEV: [],
    checkedDev: [],
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
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
      devices: this.data.pre_devices,
      checkedDev: pre_checkedDev
    });
  },
  confirm: function () {
    this.setData({
      hiddenmodal: true,
      choosedDEV: this.data.checkedDev
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
    for (var i = 0; i < value.length; i++) {
      var item = value[i].name
      checkedDev.push(item)
    }
    this.setData({
      checkedDev: checkedDev
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
    if (!name.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入人员名称',
        icon: 'none',
      })
      return
    }
    if (!phone.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入该人员手机号',
        icon: 'none',
      })
      return
    }
    console.log(values)
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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