var timeoutID
var util = require("../../utils/util.js")
var app=getApp()

var touchDot = 0;//触摸时的原点
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理时间记录
Page({

  data: {
    recordList: [],
    strangeList: [],
    stgNoResult: false,
    stgPageNum: 1,
    noResult: false,
    pageNum: 1,
    hideSearch: false,
    sysHeight: 0,
    currentTab: 0,
    rpx2px: 1,
  },

  //滑动切换tab
  bindChange: function (e) {
    var that = this
    that.setData({ currentTab: e.detail.current })
    var recordList = that.data.recordList.length
    var strangeList = that.data.strangeList.length
    var rpx2px=that.data.rpx2px
    var sysHeight = that.data.sysHeight
    if (e.detail.current == 0) {
      
      that.setData({ height: (222 * recordList * rpx2px) > sysHeight ? (222 * recordList * rpx2px) : sysHeight})

    } else {

      that.setData({ height: (222 * strangeList * rpx2px) > sysHeight ? (222 * strangeList * rpx2px) : sysHeight })
    }

  },
  //点击tab切换
  swichNav: function (e) {
    var that = this
    var current = e.target.dataset.current
    var recordList = that.data.recordList.length
    var strangeList = that.data.strangeList.length
    var rpx2px = that.data.rpx2px
    var sysHeight = that.data.sysHeight
    if (this.data.currentTab === current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (current == 0) {
        that.setData({ height: (222 * recordList * rpx2px) > sysHeight ? (222 * recordList * rpx2px) : sysHeight })
      } else {
        that.setData({ height: (222 * strangeList * rpx2px) > sysHeight ? (222 * strangeList * rpx2px) : sysHeight })
      }
    }
  },

  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          rpx2px: res.windowWidth/750,
          height: res.windowHeight,
          sysHeight: res.windowHeight
          //height: 700
        })
      }
    })

    this.init(true)
  },

  onShow: function(){
    util.redotListener()
  },

  search: function(){
    wx.navigateTo({
      url: '/pages/searchRes/searchRes?tag=' + 1,
    })
  },

  searchStg: function () {
    wx.navigateTo({
      url: '/pages/searchRes/searchSta/searchSta',
    })
  },
  //页面滚动监听
  onPageScroll: function (e) {
    if (typeof (timeoutID)!="undefined"){
      clearTimeout(timeoutID)
    }
    var that=this
    // console.log(e);
    that.setData({
      hideSearch: true
    })
    timeoutID=setTimeout(function(){
      that.setData({
        hideSearch: false
      })
    },2000)
  },

  onPullDownRefresh: function () {
    this.reload(true)
  },

  //下拉刷新触发
  reload(reload) {
    this.setData({
      noResult: false,
      pageNum: 1,
      stgNoResult: false,
      stgPageNum: 1,
    })
    
    this.init(reload)
  },
  init(reload) {
    this.getList(reload)
  },
  // 获取列表
  getList(reload) {
    var that = this
    var recordList = that.data.recordList.length
    var strangeList = that.data.strangeList.length
    var rpx2px = that.data.rpx2px
    var sysHeight = that.data.sysHeight
    if (reload) {
      this.setData({
        pageNum: 1,
        stgPageNum: 1,
      })
    }
    if(that.data.currentTab==0 || reload){
      //通行记录get
      wx.request({
        url: getApp().globalData.server + '/AccessRecords/getAccessRecordsFromWx.do',
        data: {
          pageIndex: that.data.pageNum - 1,
          clientId: app.globalData.admin.clientId
        },
        method: 'post',
        success: (res) => {
          let data = res.data
          console.log(data)
          let list = data.recordList
          //console.log(util.isEmptyObject(list))
          if (list.length) {
            let pageNum = this.data.pageNum + 1
            this.setData({
              pageNum,
              recordList: reload ? list : this.data.recordList.concat(list),
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
            } else {
              this.setData({
                recordList: [],
              })
            }
          }
          //更新长度
          that.setData({ height: (222 * recordList * rpx2px) > sysHeight ? (222 * recordList * rpx2px) : sysHeight })
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
    }
    if (that.data.currentTab == 1 || reload) {
      //陌生记录get
      wx.request({
        url: getApp().globalData.server + '/CaptureRecords/getStrangeRecordsFromWx.do',
        data: {
          pageIndex: that.data.stgPageNum - 1,
          // pageIndex: 0,
          // strangeList,stgNoResult,stgPageNum

          clientId: app.globalData.admin.clientId
        },
        method: 'post',
        success: (res) => {
          console.log("当前页码:" + that.data.stgPageNum)
          let data = res.data
          console.log(data)
          let list = data.recordList
          if (list.length) {
            let stgPageNum = this.data.stgPageNum + 1
            this.setData({
              stgPageNum,
              strangeList: reload ? list : this.data.strangeList.concat(list),
            })
          } else {
            this.setData({
              stgNoResult: true,
            })
            if (that.data.stgPageNum != 1) {
              wx.showToast({
                title: '已加载至最底!',
                icon: 'none',
              })
            } else {
              this.setData({
                strangeList: [],
              })
            }
          }
          //更新长度
          that.setData({ height: (222 * strangeList * rpx2px) > sysHeight ? (222 * strangeList * rpx2px) : sysHeight })
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
    }
    
  },
  onReachBottom: function () {
    if(this.data.currentTab==0){
      if (!this.data.recordList.length || !this.data.noResult) {
        this.getList()
      }
    }else{
      if (!this.data.strangeList.length || !this.data.stgNoResult) {
        this.getList()
      }
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})