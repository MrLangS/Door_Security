var util = require('../../utils/util.js')
var year = util.getPicker('year')
var month = util.getPicker('month')
var day = util.getPicker('day')
var app = getApp()
//缓存 日期选择器 改变前的日期
function buff(that) {
  year = that.data.year
  month = that.data.month
  day = that.data.day
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '',
    recordList: [],
    staffList: [],
    hiddenmodal: true,
    years: util.getPickerList('years'),
    year: year,
    months: util.getPickerList('months'),
    month: month,
    days: util.getPickerList('days'),
    day: day,
    value: util.getPicker('arr'),
    noResult: false,
    pageNum: 1,
    tag: 0,
    searchVal: '',
    disabled: false,
    id: 0
  },

  bindinput: function(e){
    console.log(e.detail.value)
    this.setData({
      searchVal: e.detail.value,
      staffList: []
    })
    if (e.detail.value==""){
      staffList: []
    }else{
      this.getList(true,this.data.searchVal)
    }
  },
  //弹出框
  chooseDay: function () {
    if(this.data.tag==1){
      buff(this)
      console.log("改变前日期为:" + year + "/" + month + "/" + day)
      this.setData({
        hiddenmodal: !this.data.hiddenmodal
      })
    }
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
      year: year,
      month: month,
      day: day
    });
  },
  confirm: function () {
    var date = util.formatDay(this)
    console.log(date)
    this.setData({
      hiddenmodal: true,
      searchVal: date,
      recordList: [],
    })
    this.getList(true, date)
  },
  //日期选择器事件
  bindChange: function (e) {
    const val = e.detail.value
    console.log(val)
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },
  //刷新触发
  reload(reload) {
    this.setData({
      noResult: false,
      pageNum: 1,
    })
    this.init(reload, this.data.searchVal)
  },
  init(reload, value) {
    this.getList(reload, value)
  },
  // 获取小册列表
  getList(reload, value) {
    var that = this
    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    var requestUrl = ''
    if(this.data.tag==1){
      requestUrl = getApp().globalData.server + '/AccessRecords/getAccessRecordsFromWx.do'
      wx.request({
        url: requestUrl,
        data: {
          searchDay: value,
          pageIndex: this.data.pageNum - 1,
          // regionId: app.globalData.admin.regionId,
          clientId: app.globalData.admin.clientId
        },
        method: 'post',
        success: (res) => {
          console.log("当前页码:" + that.data.pageNum)
          let data = res.data
          console.log(data)
          let list = data.recordList
          if (!util.isEmptyObject(list)) {
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
                recordList: []
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
    }else if(this.data.tag==0){
      requestUrl = getApp().globalData.server + '/TransitPerson/getPersonsFromWx.do'
      wx.request({
        url: requestUrl,
        data: {
          personName: value,
          pageIndex: this.data.pageNum - 1,
          clientId: parseInt(this.data.id)
        },
        method: 'post',
        success: (res) => {
          console.log("当前页码:" + that.data.pageNum)
          let data = res.data
          console.log(data)
          let list = data
          if (!util.isEmptyObject(list)) {
            let pageNum = this.data.pageNum + 1
            this.setData({
              pageNum,
              staffList: reload ? list : this.data.staffList.concat(list),
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
                staffList: []
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
    }
    
  },

  onLoad: function (options) {
    //tag=1代表查询通行记录；tag=0代表查询人员信息
    if(options.tag==1){
      this.setData({
        tag: 1,
        disabled: true
      })
      this.getList(true, util.formatDay(this))
    }
    if (options.tag == 0) {
      console.log(options.id)
      this.setData({
        placeholder: '查询人员',
        tag: 0,
        id: options.id
      })
    }
  },

  onShow: function(){
    if (this.data.searchVal!=""){
      this.getList(true, this.data.searchVal)
    }
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {
    if (!this.data.recordList.length || !this.data.noResult) {
      this.getList(false, this.data.searchVal)
    }
  },

  onShareAppMessage: function () {

  }
})