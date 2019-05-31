var util = require("../../utils/util.js")
var app = getApp()
Page({

  data: {
    hiddenmodal: true,
    months: [],
    month: '',
  },

  choose: function () {
    var that = this
    this.setData({
      hiddenmodal: false
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
    });
  },
  confirm: function () {
    this.setData({
      hiddenmodal: true,

    })
    wx.request({
      url: app.globalData.server + '/ClockingIn/queryPersonClockingIn.do?personId=' + this.data.dataArr[2]
        + '&&searchMonth=' + this.data.month,
      method: 'post',
      success: res => {
        this.setData({
          data: res.data
        })
      }
    })
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
        months: checkBox,
        month: checkBox[index].val
      })
    }
  },

  getMonths(){
    var date = new Date()
    var months = []
    for(var i=0; i<9; i++){
      var month = date.getMonth()+1;
      month = month < 10 ? '0' + month : month
      months.push({val : date.getFullYear()+'-'+month})
      date.setMonth(date.getMonth() - 1);
    }
    this.setData({ months : months})
  },

  onLoad: function (options) {
    this.getMonths()

    if(options.isAdmin=='false'){
      if (typeof (options.data) != "undefined") {
        var json = JSON.parse(options.data)
        var arr = [json.person.photoURL, json.person.personName, json.person.id]
        this.setData({
          dataArr: arr,
        })
      }
    }else{
      if (typeof (options.data) != "undefined") {
        var json = JSON.parse(options.data)
        var arr = [json.userPhotoURL, json.userName, json.id]
        this.setData({
          dataArr: arr,
        })
      }
    }

    if (options.isAdmin == 'staff'){
      var arr = [app.globalData.sysWXUser.photoURL, app.globalData.staff.personName, app.globalData.staff.id]
      this.setData({
        dataArr: arr,
      })
    }

    wx.request({
      url: app.globalData.server + '/ClockingIn/queryPersonClockingIn.do?personId=' + this.data.dataArr[2]
        + '&&searchMonth=' + util.getCurrentTime().substr(0, 7),
      method: 'post',
      success: res => {
        this.setData({
          data: res.data
        })
      }
    })
  },

})