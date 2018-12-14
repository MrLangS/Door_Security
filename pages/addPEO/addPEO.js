var util = require("../../utils/util.js")
var pre_checkedDev = []
var pre_checkedId = []
var app=getApp()

Page({

  data: {
    companyId: 0,
    companyName: '',
    devices: [],
    pre_devices: [],
    avatar: '',
    picId: 0,
    hiddenmodal: true,
    choosedDEV: [],
    checkedDev: [],
    checkedId: [],
    choosedId: [],
    tag: false,
    btnTag: false,
    personName: '',
    personPhone: '',
  },
  getName: function(e){
    this.setData({
      personName: e.detail.value
    })
  },
  getPhone: function (e) {
    this.setData({
      personPhone: e.detail.value
    })
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
    this.setData({
      tag: e.detail.value=='admin'? true : false
    })
    // if (e.detail.value == 'admin'){
    //   wx.showToast({
    //     title: '确认后需选择微信用户进行转发，并通知他填写手机号进行验证，对方验证通过后子管理员方能添加成功!',
    //     icon: 'none',
    //     duration: 6000,
    //   })
    // }
  },
  commit: function (e) {
    var that=this
    let values = e.detail.value
    let name = values.name || ''
    let phone = values.phone || ''
    console.log(values)
    
    if (util.checkStaffForm(this,name,phone)){
      if(this.data.tag==false){
        wx.request({
          url: app.globalData.server + '/TransitPerson/isNameRepeated.do',
          data: {
            personName: name,
            clientId: parseInt(that.data.companyId),
          },
          method: 'post',
          success: (res) => {
            console.log(res)
            if (res.data) {
              //判断手机号
              wx.request({
                url: app.globalData.server + '/TransitPerson/isPhoneRepeated.do',
                data: {
                  phoneNo: phone,
                  clientId: parseInt(that.data.companyId),
                },
                method: 'post',
                success: (res) => {
                  console.log(res)
                  if (res.data) {
                    if (that.data.tag) {

                    } else {
                      wx.request({
                        url: app.globalData.server + '/TransitPerson/addPersonFromWx.do',
                        data: {
                          person: {
                            personName: name,
                            phoneNo: phone,
                            clientId: this.data.companyId,
                            personCompany: this.data.companyName,
                            picId: this.data.picId
                          },
                          devices: this.data.choosedId
                        },
                        method: 'post',
                        success: (res) => {
                          console.log(res)
                          if (res.data == "SUCCESS") {
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
                          } else {
                            wx.showToast({
                              title: '添加失败，请确认后重试',
                              icon: 'none',
                              duration: 1000,
                            })
                          }
                        }
                      })
                    }

                  } else {
                    wx.showToast({
                      title: '抱歉！该手机号  重复，添加失败',
                      icon: 'none',
                      duration: 1500
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '抱歉！人员名称重复，添加失败',
                icon: 'none',
                duration: 1500
              })
            }
          }
        })
      }else{
        that.setData({
          btnTag: true
        })
      }
      
    }  
  },

  chooseImg: function(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/TransitPerson/uploadPhotoFromWx.do"
        var tempFilePaths = res.tempFilePaths
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            // console.log('data:image/png;base64,' + res.data)
            console.log(res)
            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                personPhoto: res.data
              },
              success: (res) => {
                console.log('上传图片请求结果：')
                console.log(res)
                if (res.data.msg == 'ok') {
                  that.setData({
                    avatar: res.data.photoURL,
                    picId: res.data.picId,
                    quality: 0,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options.id) != "undefined") {
      console.log("公司id为" + options.id)
      this.setData({
        companyId: options.id,
        companyName: options.name
      })
      wx.request({
        url: app.globalData.server + '/DoorDevice/getClientDevices.do?clientId=' + options.id,
        method: 'post',
        success: (res) => {
          console.log(res)
          this.setData({
            devices: res.data
          })
        }
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
    var that = this
    var subAdmin={
      companyId: this.data.companyId,
      companyName: this.data.companyName,
      name: this.data.personName,
      phone: this.data.personPhone,
      picId: this.data.picId,
    }
    return {
      title: '子管理员',
      path: '/pages/subAdmin/subAdmin?subAdmin=' + JSON.stringify(subAdmin),
      // imageUrl: '../resource/images/inv.jpg',
      success: function (res) {
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
        wx.showToast({
          title: '转发失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
    
  }
})