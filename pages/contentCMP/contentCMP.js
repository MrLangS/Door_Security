var util = require("../../utils/util.js")
var timeoutID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: {},
    dataArr:[],
    admin: [],
    staff: [],
    noResult: false,
    pageNum: 1,
    startX: 0, //开始坐标
    startY: 0,
    hideSearch: true,
    isModify: false,
    isAdd: false
  },

  search: function () {
    wx.navigateTo({
      url: '/pages/searchRes/searchRes?tag='+0+'&id='+this.data.company.id,
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
        if (tempFilePaths.length > 0) {
          wx.uploadFile({
            url: uploadUserUrl,
            filePath: tempFilePaths[0],
            name: 'logoPhoto',
            header: { "Content-Type": "multipart/form-data" },
            success: function (res) {
              console.log('上传图片请求...')
              var data = JSON.parse(res.data)
              console.log(data)
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
                  icon: 'loading',
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
          console.log(res)
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
      url: '/pages/contentPEO/contentPEO?data='+JSON.stringify(data),
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
      this.data.admin.splice(e.currentTarget.dataset.index, 1)
      this.setData({
        admin: this.data.admin
      })
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
                console.log(res)
                if (res.data == "SUCCESS") {
                  that.data.staff.splice(index, 1)
                  that.setData({
                    staff: that.data.staff
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
  // 获取小册列表
  getList(reload) {
    var that = this
    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    console.log(this.data.company.id)
    wx.request({
      url: getApp().globalData.server + '/TransitPerson/getPersonsFromWx.do',
      data: {
        pageIndex: that.data.pageNum - 1,
        // pageIndex: 0,
        clientId: this.data.company.id
      },
      method: 'post',
      success: (res) => {
        console.log("当前页码:" + that.data.pageNum)
        console.log(res)
        let list = res.data
        if (!util.isEmptyObject(list)) {
          let pageNum = this.data.pageNum + 1
          this.setData({
            pageNum,
            staff: reload ? list : this.data.staff.concat(list),
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (typeof(options.data)!="undefined"){
      var json=JSON.parse(options.data)
      // var arr = util.JsonToArray(JSON.parse(options.data))
      var arr = [json.clientLogoURL, json.name, json.addr]
      console.log(arr)
      this.setData({
        dataArr: arr,
        company: json
      })
    }

    //加载人员列表
    // this.reload(true)

    var items = that.data.admin
    for (var i = 0; i < items.length; i++) {
      items[i].isTouchMove = false //默认隐藏删除
    }
    that.setData({
      admin: items
    });
    items = that.data.staff
    for (var i = 0; i < items.length; i++) {
      items[i].isTouchMove = false //默认隐藏删除
    }
    that.setData({
      staff: items
    });
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

  }
})