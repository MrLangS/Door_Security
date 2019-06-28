var app = getApp()
var pre_checkedDev = []
var pre_checkedId = []
var app = getApp()
Page({

  data: {
    photo: '',
    devices: [],
    pre_devices: [],
    hiddenmodal: true,
    choosedDEV: [],
    checkedDev: [],
    checkedId: [],
    choosedId: [],
    active: false,
    percent: 0,
    progressColor: '#3281ff',
    showType: true
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
      checkedDev.push(item)
      checkedId.push(itemId)
    }
    this.setData({
      checkedDev: checkedDev,
      checkedId: checkedId
    })
  },
  //上传单位图片
  chooseImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/ClientInfoAction!uploadPhoto.do"
        var tempFilePaths = res.tempFilePaths
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            // console.log('data:image/png;base64,' + res.data)
            console.log(res)
            that.setData({
              percent: 0,
            })
            that.setData({
              percent: 100,
              progressColor: '#3281ff',
              active: true
            })

            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                logoPhoto: res.data
              },
              success: (res) => {
                console.log('上传图片请求结果：')
                var data = res.data
                console.log(data)
                if (typeof (data.photoURL) != "undefined") {
                  that.setData({
                    photo: data.photoURL,
                  })
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1500
                  })
                } else {
                  that.setData({
                    progressColor: 'red',
                  })
                  wx.showToast({
                    title: '上传失败,请重试!',
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
              },
              complete: (res) => {
                that.setData({
                  active: false,
                })
              }
            })
          }
        })

      },
    })
  },
  commit:function(e){
    var that=this
    let values = e.detail.value
    console.log(values)
    let cmpname = values.cmpname || ''
    let address = values.address || ''
    let type = (values.role == 'child') ? 1 : 2
    console.log(type)
    if (!cmpname.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入单位名称',
        icon: 'none',
      })
      return
    }
    if (!values.address.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
      })
      return
    }
    wx.request({
      url: app.globalData.server + '/ClientInfoAction!addCompany.do',
      data:{
        name: values.cmpname,
        addr: values.address,
        unitType: type,
        clientLogoURL: that.data.photo,
        superiorClientId: parseInt(that.data.higherId),
        devices: that.data.choosedId
      },
      method: 'post',
      success: function(res){
        console.log('添加成功')
        console.log(res)
        if(res.data=="SUCCESS"){
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500
          })
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            isNew: true
          })
          wx.navigateBack({})
        }else{
          wx.showToast({
            title: '添加失败，请重试',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },

  onLoad: function (options) {
    console.log('type:'+options.type)
    var that = this
    let type = 0
    if (options.type == 'null' || options.type == '1'){
      type = 1
    } else {
      type = 2
    }
    that.setData({
      higherId: options.id,
      type: type
    })
    wx.request({
      url: app.globalData.server + '/DoorDevice/getClientDevices.do?clientId=' + options.id,
      method: 'post',
      success: (res) => {
        console.log(res)
        that.setData({
          devices: res.data
        })
      }
    })

    
  },

  onShow: function () {

  },

})