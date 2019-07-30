var app = getApp()
var util = require("../../utils/util.js")

Page({
  data: {
    // companys: [{ client: { name: '测试1', addr: '地址1' } }, { client: { name: '测试2', addr: '地址2' } }],
    companys: [],
    startX: 0, //开始坐标
    startY: 0,
    isMajorUser: true,
    hiddenmodal: true,
    hiddenCMPmodal: true,
    show: false,
    months: [],
    sum: 0,
    flag: false,
    monthflag: false,
    init: true,
    month: '',
    modIndex: 0,
    id4excel: 0
  },

  navigate2perList: function () {
    wx.navigateTo({
      url: '../perRegister/perList/perList',
    })
  },

  gotoDevice:function() {
    wx.switchTab({
      url: '../device/device',
    })
  }, 

  gotoRecord: function() {
    wx.switchTab({
      url: '../record/record',
    })
  },

  chooseImg: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var company = that.data.company
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
            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                logoPhoto: res.data
              },
              success: (res) => {
                var data = res.data
                if (typeof (data.photoURL) != "undefined") {
                  wx.request({
                    url: getApp().globalData.server + '/ClientInfoAction!updateClient.do',
                    data: {
                      id: company.id,
                      clientLogoURL: data.photoURL,
                      name: company.name,
                      addr: company.addr
                    },
                    method: 'post',
                    success: function (res) {
                      console.log(res)
                      company.clientLogoURL = data.photoURL
                      that.setData({
                        company: company
                      })
                    }
                  })
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1500
                  })
                } else {
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
              }
            })
          }
        })
      },
    })

  },

  toggleDialog(e) {
    this.setData({
      companyName: this.data.company.name,
      address: this.data.company.addr,
      init: false,
      show: true
    })
  },

  toggleCancel(){
    this.toggle()
  },
  toggleSure() {
    var that = this
    this.toggle()
    wx.request({
      url: getApp().globalData.server + '/ClientInfoAction!updateClient.do',
      data: {
        id: this.data.company.id,
        clientLogoURL: this.data.company.clientLogoURL,
        name: this.data.companyName,
        addr: this.data.address
      },
      method: 'post',
      success: function (res) {
        if(res.data=='SUCCESS') {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          })
          wx.request({
            url: app.globalData.server + '/ClientInfoAction!getAllSubordinateClient.do?id=' + app.globalData.admin.clientId,
            data: { id: app.globalData.admin.clientId },
            method: 'post',
            success: function (res) {
              that.setData({
                company: res.data.client
              })
            }
          })
        }
      }
    })
  },
  toggle(){
    var that = this
    that.setData({
      show: !that.data.show
    })
  },
  inName(e) {
    this.setData({
      companyName: e.detail.value
    })
  },
  inAddr(e) {
    this.setData({
      address: e.detail.value
    })
  },

  getMonths() {
    var date = new Date()
    var months = []
    for (var i = 0; i < 9; i++) {
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month
      months.push({ val: date.getFullYear() + '-' + month })
      date.setMonth(date.getMonth() - 1)
    }
    this.setData({ months: months })
  },

  //弹出框
  choose: function (e) {
    var that = this
    this.setData({
      hiddenCMPmodal: false,
    })
  },
  cancelCMP: function () {
    this.setData({
      hiddenCMPmodal: true,
    });
  },
  confirmCMP: function () {
    if(this.data.flag){
      this.setData({
        hiddenCMPmodal: true,
        hiddenmodal: false,
      });
    }else{
      wx.showToast({
        title: '请选择单位',
        icon: 'none',
        duration: 1500
      })
    }
    
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
    });
  },
  //确认生成表格
  confirm: function () {
    if (this.data.monthflag){
      this.setData({
        hiddenmodal: true
      })

      wx.request({
        url: app.globalData.server + '/ClockingIn/exportReport.do?unitId=' + this.data.id4excel + '&&searchMonth=' + this.data.month,
        method: 'get',
        success: res => {
          wx.downloadFile({
            url: res.data,
            success(res) {
              wx.openDocument({
                filePath: res.tempFilePath,
                success(res) {
                  console.log('打开文档成功')
                  wx.showToast({
                    title: '正在加载...',
                    icon: 'loading',
                    duration: 1000
                  })
                },
                fail(res) {
                  console.log(res)
                }
              })
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '请选择月份',
        icon: 'none',
        duration: 1500
      })
    }
    
    
  },

  //多选
  cmpCheck: function(e) {
    let index = e.currentTarget.dataset.id;//获取用户当前选中的索引值
    let checkBox = this.data.companys;

    if (!checkBox[index].checked) {
      for (var one of checkBox) {
        one.checked = false
      }
      checkBox[index].checked = true;
      this.setData({
        flag: true,
        companys: checkBox,
        id4excel: checkBox[index].id
      })
    }
    
  },

  //多选
  userCheck: function (e) {
    let index = e.currentTarget.dataset.id;//获取用户当前选中的索引值
    let checkBox = this.data.months;

    if (!checkBox[index].checked) {
      for (var one of checkBox) {
        one.checked = false
      }
      checkBox[index].checked = true;
      this.setData({
        monthflag: true,
        months: checkBox,
        month: checkBox[index].val
      })
    }

  },

  bindChange: function(e){
    console.log(e)
    this.setData({
      year: this.data.years[e.detail.value[0]],
      month: this.data.months[e.detail.value[1]]
    })
  },

  newCMP:function(){
    wx.navigateTo({
      url: '../addCMP/addCMP',
    })
  },

  navigatItem:function(e){
    wx.navigateTo({
      url: '../contentCMP/contentCMP',
    })
  },

  //删除事件
  del: function (e) {
    var that=this
    var index = e.currentTarget.dataset.index
    var id = that.data.companys[index].client.id
    if (app.globalData.admin.clientId == id){
      wx.showToast({
        title: '主单位不能删除!',
        icon: 'none',
        duration: 1500
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '删除单位会一并删除该单位下所有员工，确定删除吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.server + '/ClientInfoAction!deleteClient.do?id=' + id,
              data: {},
              method: 'post',
              success: function (res) {
                console.log(res)
                if (res.data == "SUCCESS") {
                  that.data.companys.splice(index, 1)
                  that.setData({
                    companys: that.data.companys
                  })
                  wx.showToast({
                    title: '删除成功!',
                    icon: 'success',
                    duration: 1500
                  })
                } else {
                  wx.showToast({
                    title: '删除失败，请稍后再试!',
                    icon: 'none',
                    duration: 1500
                  })
                }
              }
            })
          }
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMonths()
    var that = this;

    that.setData({
      isMajorUser: app.globalData.isMajorUser,
    });
  },

  getCompanySet: function (companys,companySet){
    var that = this
    companys.push(companySet.client)
    var children = companySet.children
    if (children == null || children.length == 0) {
      return
    }
    for (let j = 0; j < children.length; j++) {
      that.getCompanySet(companys, children[j])
    }
  },

  onShow: function () {
    var that=this
    var arr = []
    wx.hideTabBarRedDot({
      index: 0,
    })
    wx.request({
      url: app.globalData.server + '/ClientInfoAction!getAllSubordinateClient.do?id=' + app.globalData.admin.clientId,
      data: { id: app.globalData.admin.clientId},
      method: 'post',
      success: function(res){
        
        app.globalData.companySet = res.data
        let companys=[]
        that.getCompanySet(companys,res.data)
        that.setData({
          company: res.data.client,
          companys: companys,
          flag: false
        })
      }
    })

    wx.request({
      url: app.globalData.server + '/TransitPerson/getUnauditedPersons.do',
      data: {
        clientId: app.globalData.admin.clientId,
        pageIndex: 0
      },
      method: 'post',
      success: function (res) {
        that.setData({
          sum: res.data.totalCount
        })
      }
    })

    
  },

})