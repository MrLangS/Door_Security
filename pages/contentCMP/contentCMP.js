var util = require("../../utils/util.js")
var app = getApp()
var timeoutID
var app = getApp()
var util = require("../../utils/util.js")
var year = util.getPicker('year')
var month = util.getPicker('month')
var value = util.getPicker('arr')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: {},
    dataArr:[],
    admin: [],
    staff: [],
    devs: [],
    noResult: false,
    pageNum: 1,
    startX: 0, //开始坐标
    startY: 0,
    hideSearch: true,
    isModify: false,
    isAdd: false,
    isMajorUser: true,
    hiddenmodal: true,
    value: value,
    years: util.getPickerList('years'),
    months: util.getPickerList('months'),
    year: year,
    month: month,
    peoInfo: '',
  },

  peoAttendance: function (e) {
    var data = {}
    var isAdmin = null
    if (typeof (e.currentTarget.dataset.flag) == "undefined") {
      data = this.data.admin[e.currentTarget.dataset.index]
      isAdmin = true
    } else {
      data = this.data.staff[e.currentTarget.dataset.index]
      isAdmin = false
    }
    
    wx.navigateTo({
      url: '/pages/peoAttendance/peoAttendance?data=' + JSON.stringify(data) + '&&isAdmin=' + isAdmin,
    })
  },

  set2staff: function(e) {
    var index = e.currentTarget.dataset.index

    var admin = this.data.admin[index]
    console.log(admin.id)
    if(app.globalData.admin.id == admin.id){
      wx.showToast({
        title: '不能设置自身为普通员工',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.showModal({
        title: '人员管理',
        content: '确认将' + admin.userName + '设置为普通用户吗',
        success: res => {
          if (res.confirm) {
            wx.request({
              url: app.globalData.server + '/UserAction!changeUserLevel.do',
              data: {
                changeType: 1,
                adminId: admin.id
              },
              method: 'post',
              success: res => {
                console.log(res)
                this.reload(true)//更新普通员工列表
                this.updateAdminList()//更新管理员
                if (res.data == 'SUCCESS') {
                  wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                    duration: 1500
                  })
                } else {
                  wx.showToast({
                    title: '设置失败',
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
  set2admin: function (e) {
    var index = e.currentTarget.dataset.index

    var staff = this.data.staff[index].person
    console.log(staff)
    if (staff.phoneNo==''||staff.phoneNo==null){
      wx.showToast({
        title: '该人员手机号为空，不能设为管理员',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.showModal({
        title: '人员管理',
        content: '确认将' + staff.personName + '设置为管理员吗',
        success: res => {
          if (res.confirm) {
            wx.request({
              url: app.globalData.server + '/UserAction!changeUserLevel.do',
              data: {
                changeType: 2,
                personId: staff.id
              },
              method: 'post',
              success: res => {
                console.log(res)
                this.reload(true)//更新普通员工列表
                this.updateAdminList()//更新管理员
                if (res.data == 'SUCCESS') {
                  wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                    duration: 1500
                  })
                } else if (res.data == 'ISEXIST') {
                  wx.showToast({
                    title: '该用户已存在管理员',
                    icon: 'none',
                    duration: 1500
                  })
                } else {
                  wx.showToast({
                    title: '设置失败',
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

  bindChange: function (e) {
    this.setData({
      year: this.data.years[e.detail.value[0]],
      month: this.data.months[e.detail.value[1]]
    })
  },

  search: function () {
    wx.navigateTo({
      url: '/pages/searchRes/searchRes?tag='+0+'&id='+this.data.company.id,
    })
  },
  //拨打电话
  makeCall: function(e){
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: this.data.admin[e.currentTarget.dataset.index].phoneNum
    })
  },
  chooseImg: function(){
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
            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                logoPhoto: res.data
              },
              success: (res) => {
                var data = res.data
                var dataArr=that.data.dataArr
                if (typeof (data.photoURL) != "undefined") {
                  dataArr[0] = data.photoURL
                  that.setData({
                    dataArr: dataArr,
                  })
                  wx.request({
                    url: getApp().globalData.server + '/ClientInfoAction!updateClient.do',
                    data: {
                      id: that.data.company.id,
                      clientLogoURL: that.data.dataArr[0],
                      name: that.data.dataArr[1],
                      addr: that.data.dataArr[2]
                    },
                    method: 'post',
                    success: function (res) {
                      console.log(res)
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
  preview: function(){
    var that = this
    var imgURL = this.data.dataArr[0]
    if (imgURL==""){
      wx.showToast({
        title: '尚未添加公司logo',
        icon: 'none',
        duration: 1500,
      })
    }else{
      wx.getImageInfo({
        src: imgURL,
        success: (res)=>{
          wx.previewImage({
            current: res.path,
            urls: [res.path],
          })
        }
      })
      
    } 
  },
  //页面滚动监听
  onPageScroll: function (e) {
    if (typeof (timeoutID) != "undefined") {
      clearTimeout(timeoutID)
    }
    var that = this
    // console.log(e);
    that.setData({
      hideSearch: false
    })
    timeoutID = setTimeout(function () {
      that.setData({
        hideSearch: true
      })
    }, 2000)
  },
  newCMP:function(){
    wx.navigateTo({
      url: '../addPEO/addPEO?id=' + this.data.company.id + '&name=' + this.data.company.name,
    })
  },
  //列表项操作
  navigateItem:function(e){
    this.setData({
      isModify: false,
    })
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  //人员部分
  navigatItem:function(e){
    var data={}
    if(typeof(e.currentTarget.dataset.flag)=="undefined"){
      data = this.data.admin[e.currentTarget.dataset.index]
    }else{
      data = this.data.staff[e.currentTarget.dataset.index]
    }
    wx.navigateTo({
      url: '/pages/contentPEO/contentPEO?data='+JSON.stringify(data)+'&flag=1',
    })
  },
  
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    if (typeof (e.currentTarget.dataset.flag)=="undefined"){
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        admin: this.start(e, this.data.admin, 'admin')
      })
    }else{
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        staff: this.start(e, this.data.staff, 'staff')
      }) 
    }
  },
  start: function(e,roles,name){
    //开始触摸时 重置所有删除
    roles.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    return roles
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    if (typeof (e.currentTarget.dataset.flag) == "undefined") {
      //更新数据
      that.setData({
        admin: this.move(this.data.admin, 'admin', angle, index, touchMoveX, startX, that)
      })
    } else {
      //更新数据
      that.setData({
        staff: this.move(this.data.staff, 'staff', angle, index, touchMoveX, startX, that)
      })  
    }
  },
  move: function (roles, name, angle, index, touchMoveX, startX,that){
    roles.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    return roles
  },

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function (e) {
    var that=this
    if (typeof (e.currentTarget.dataset.flag)=="undefined"){
      var index = e.currentTarget.dataset.index
      var id = that.data.admin[index].id
      if(app.globalData.admin.id!=id){
        wx.showModal({
          title: '提示',
          content: '确定删除' + this.data.admin[index].userName + '吗？',
          success: function (res) {
            if (res.confirm) {
              wx.request({
                url: getApp().globalData.server + '/UserAction!deleteById.do?id=' + id,
                data: {},
                method: 'post',
                success: function (res) {
                  if (res.data == 1) {
                    that.data.admin.splice(index, 1)
                    that.setData({
                      admin: that.data.admin
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
      }else{
        wx.showToast({
          title: '不能删除自身用户!',
          icon: 'none',
          duration: 1500
        })
      }
      
    }else{
      var index = e.currentTarget.dataset.index
      wx.showModal({
        title: '提示',
        content: '确定删除' + this.data.staff[index].person.personName+'吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: getApp().globalData.server + '/TransitPerson/deletePersonFromWx.do?personId=' + that.data.staff[index].person.id,
              data: {},
              method: 'post',
              success: function (res) {
                if (res.data == "SUCCESS") {
                  that.data.staff.splice(index, 1)
                  that.setData({
                    staff: that.data.staff,
                    totalCount: that.data.totalCount-1
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

  //列表分页下拉
  //下拉刷新触发
  reload(reload) {
    this.setData({
      noResult: false,
      pageNum: 1,
    })
    this.init(reload)
  },
  init(reload) {
    this.getList(reload)
  },
  // 获取人员列表
  getList(reload) {
    var that = this
    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    wx.request({
      url: getApp().globalData.server + '/TransitPerson/getPersonsFromWx.do',
      data: {
        pageIndex: that.data.pageNum - 1,
        clientId: this.data.company.id
      },
      method: 'post',
      success: (res) => {
        let list = res.data.persons
        if (!util.isEmptyObject(list)) {
          let pageNum = this.data.pageNum + 1
          this.setData({
            pageNum,
            staff: reload ? list : this.data.staff.concat(list),
            totalCount: res.data.totalCount
          })
        } else {
          this.setData({
            noResult: true,
          })
          if (that.data.pageNum != 1) {
            wx.showToast({
              title: '已加载至最底!',
              icon: 'none',
            })
          }else{
            this.setData({
              staff: [],
              totalCount: 0,
            })
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      },
      complete: () => {
        wx.stopPullDownRefresh()
      },
    })
  },

  updateAdminList: function(){
    
    wx.request({
      url: getApp().globalData.server + '/UserAction!getClientUsers.do',
      data: {
        clientId: this.data.company.id
      },
      method: 'post',
      success: (res) => {
        this.setData({
          admin: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (typeof(options.data)!="undefined"){
      var jsonAll=JSON.parse(options.data)
      var json = jsonAll.client
      var arr = [json.clientLogoURL, json.name, json.addr]
      this.setData({
        dataArr: arr,
        company: json,
        isMajorUser: app.globalData.isMajorUser,
        devs: jsonAll.permission
      })
    }

    this.updateAdminList()
    //加载人员列表
    // this.reload(true)

    // var items = that.data.admin
    // for (var i = 0; i < items.length; i++) {
    //   items[i].isTouchMove = false //默认隐藏删除
    // }
    // that.setData({
    //   admin: items
    // });
    // items = that.data.staff
    // for (var i = 0; i < items.length; i++) {
    //   items[i].isTouchMove = false //默认隐藏删除
    // }
    // that.setData({
    //   staff: items
    // });
  },


  //生命周期函数--监听页面显示
  onShow: function () {
    if(this.data.isModify){
      console.log('保存修改信息')
      wx.request({
        url: getApp().globalData.server +'/ClientInfoAction!updateClient.do',
        data: {
          id: this.data.company.id,
          clientLogoURL: this.data.dataArr[0],
          name: this.data.dataArr[1],
          addr: this.data.dataArr[2]
        },
        method: 'post',
        success: function(res){
          console.log(res)
        }
      })
    }
    // if (this.data.isAdd){
    this.reload(true)
  },
  

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {
    if (!this.data.staff.length || !this.data.noResult) {
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    //转发部分
    return {
      title: '自助注册',
      path: 'pages/perRegister/regForm/regForm?clientId=' + that.data.company.id + '&companyName=' + that.data.company.name,
      imageUrl: '/images/flower.jpg',
      success: function (res) {
        var shareTickets = res.shareTickets;
      },
      fail: function (res) {
        wx.showToast({
          title: '邀请失败',
          duration: 1500
        })
      }
    }
  }
})