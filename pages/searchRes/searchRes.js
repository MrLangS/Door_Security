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
    // value: util.getPicker('arr'),
    value: [year-2017,month-1,day-1],
    noResult: false,
    pageNum: 1,
    tag: 0,
    valtag: 1,
    dateTag: 0,
    searchVal: '',
    disabled: false,
    codeval: true,
    id: 0
  },

  inputname(e){
    this.setData({
      searchVal: e.detail.value
    })
  },
  bindinput: function(e){
    console.log(e.detail.value)
    this.setData({
      searchVal: e.detail.value,
      staffList: []
    })
    if (e.detail.value == "") {
      staffList: []
    } else {
      this.getList(true, this.data.searchVal)
    } 
  },
  //弹出框
  chooseDay: function () {
    if(this.data.tag==1&&this.data.codeval){
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
    
    this.setData({
      hiddenmodal: true,
      dateTag: 1
      // searchVal: date,
      // recordList: [],
    })
    // this.getList(true, date)
  },
  clearContent: function(){
    this.setData({
      dateTag: 0,
      searchVal: '',
    })
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
      var searchDay=''
      // if(this.data.dateTag!=0){
      //   searchDay = util.formatDay(this)
      // }
      searchDay = util.formatDay(this)
      console.log(searchDay)
      var personName=this.data.searchVal
      wx.request({
        url: requestUrl,
        data: {
          searchDay: searchDay||'',
          personName: personName||'',
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
          if (list != null && list.length != 0) {
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
              // if (this.data.recordList.length == 0) {
                wx.showToast({
                  title: '该日无记录!',
                  icon: 'none',
                  duration: 1500,
                })
              // }
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
          clientId: app.globalData.admin.clientId,
          searchType: 1
        },
        method: 'post',
        success: (res) => {
          console.log("当前页码:" + that.data.pageNum)
          let data = res.data
          console.log(data)
          let list = data.persons
          if (list.length) {
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
              wx.showToast({
                title: '无匹配结果!',
                icon: 'none',
                duration: 1500,
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
  switchCondition: function(){
    this.getList(true)
  },
  onLoad: function (options) {
    //tag=1代表查询通行记录；tag=0代表查询人员信息
    if(options.tag==1){
      this.setData({
        tag: 1,
      })
    }
    if (options.tag == 0) {
      console.log(options.id)
      this.setData({
        placeholder: '查询人员',
        tag: 0,
        id: options.id
      })
    }
    console.log(this.data.value)
  },

  onShow: function(){
    if (this.data.searchVal!=""){
      this.getList(true, this.data.searchVal)
    }
    if(this.data.tag == 1) {
      this.getList(true)
    }
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {
    if(this.data.tag==1){
      if (!this.data.recordList.length || !this.data.noResult) {
        this.getList(false, this.data.searchVal)
      }
    }else{
      if (!this.data.staffList.length || !this.data.noResult) {
        this.getList(false, this.data.searchVal)
      }
    }
  },

  onShareAppMessage: function () {

  }
})