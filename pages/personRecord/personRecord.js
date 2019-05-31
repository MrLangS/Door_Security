var timeoutID
var util = require("../../utils/util.js")
var app = getApp()
Page({

  data: {
    recordList: [],
    noResult: false,
    pageNum: 1,
  },


  onLoad: function (options) {
    this.init(true)
  },

  onShow: function () {

  },

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
  // 获取列表
  getList(reload) {
    var that = this

    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    var page = that.data.pageNum - 1
    var personId = app.globalData.staff.id
    //通行记录get
    wx.request({
      url: getApp().globalData.server + '/AccessRecords/getOnepersonAR.do?pageIndex=' + page
        + '&personId=' + personId +'&pageSize=20',
      data: {
        pageIndex: that.data.pageNum - 1,
        personId: personId
      },
      method: 'post',
      success: (res) => {
        let data = res.data
        console.log(data)
        let list = data.recordList
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

  onPullDownRefresh: function () {
    this.reload(true)
  },

  onReachBottom: function () {
    if (!this.data.recordList.length || !this.data.noResult) {
      this.getList()
    }
  },

})