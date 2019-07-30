const app = getApp()
var util = require("../../utils/util.js")
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
let demo5_days_style = new Array;
demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#46c4f3' });
Page({
  data: {
    year: new Date().getFullYear(),      // 年份
    month: new Date().getMonth() + 1,    // 月份
    day: new Date().getDate(),
    str: MONTHS[new Date().getMonth()],  // 月份字符串
    isTouchMove: false,
    records: [1,2,3],
    select: true,
    selectMonth: '2019-07',
    currentDay: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    demo5_days_style: [],
  },
  showCalendar: function(){
    this.setData({
      select: true
    })
  },
  showList: function () {
    this.setData({
      select: false
    })
  },
  toPrev: function() {
    var arr = this.data.selectMonth.split('-')
    if(arr[1] == 1) {
      arr[0] = parseInt(arr[0]) - 1
      arr[1] = 12
    } else {
      arr[1] = parseInt(arr[1]) - 1
    }
    this.setData({
      selectMonth: arr.map(util.formatNumber).join('-')
    })
  },
  toNext: function () {
    var arr = this.data.selectMonth.split('-')
    if (arr[1] == 12) {
      arr[0] = parseInt(arr[0]) + 1
      arr[1] = 1
    } else {
      arr[1] = parseInt(arr[1]) + 1
    }
    this.setData({
      selectMonth: arr.map(util.formatNumber).join('-')
    })
  },
  bindMonth: function(e) {
    this.setData({
      selectMonth: e.detail.value
    })
  },


  setting(){
    wx.navigateTo({
      url: '../setting/setting',
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      isTouchMove: false,
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      // index = e.currentTarget.dataset.index, //当前索引
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
    //滑动超过30度角 return
    if (Math.abs(angle) < 30) {
      if (touchMoveX > startX) {
        //右滑
        that.setData({
          isTouchMove: false
        })
      } else {
        //左滑
        that.setData({
          isTouchMove: true
        })
      }
    }
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

  next: function (event) {
    console.log(event.detail)
    var date = event.detail
    demo5_days_style = new Array;
    if (date.currentYear == this.data.currentDay.year && date.currentMonth == this.data.currentDay.month) {
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#46c4f3' });
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#46c4f3' });
    } else {
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#8fdbf8' });
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#8fdbf8' });
    }

    this.setData({
      demo5_days_style: demo5_days_style,
      year: date.currentYear,
      month: date.currentMonth
    });

  },


  prev: function (event) {
    var date = event.detail
    var date = event.detail
    demo5_days_style = new Array;
    if (date.currentYear == this.data.currentDay.year && date.currentMonth == this.data.currentDay.month) {
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#46c4f3' });
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#46c4f3' });
    } else {
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#8fdbf8' });
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#8fdbf8' });
    }

    this.setData({
      demo5_days_style: demo5_days_style,
      year: date.currentYear,
      month: date.currentMonth
    });
  },

  dateChange: function (event) {
    console.log(event.detail)

    var date = event.detail
    // util.calendar(this, date.currentYear, date.currentMonth, demo5_days_style)

    demo5_days_style = new Array;
    if (date.currentYear == this.data.currentDay.year && date.currentMonth == this.data.currentDay.month) {
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#46c4f3' });
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#46c4f3' });
    } else {
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#8fdbf8' });
      demo5_days_style.push({ month: 'current', day: new Date().getDate(), color: 'white', background: '#8fdbf8' });
    }
    this.setData({
      demo5_days_style,
      year: date.currentYear,
      month: date.currentMonth
    });
  },

  dayClick: function (event) {
    var date = event.detail
    console.log( [date.year,date.month,date.day].map(util.formatNumber).join('-') )
    var day = [date.year, date.month, date.day].map(util.formatNumber).join('-')
    wx.request({
      url: app.globalData.server + '/ClockingIn/queryPersonOneDayClockingIn.do?personId=' + app.globalData.staff.id +'&searchDay='+day,
      method: 'post',
      success: res => {
        console.log(res)
        this.setData({
          attdenceData : res.data
        })
      }
    })

    //日历显示调整
    demo5_days_style.pop()
    if (date.year > this.data.year) {
      demo5_days_style.push({ month: 'next', day: date.day, color: 'white', background: '#eb4986' });
    } else if (date.year == this.data.year) {
      if (date.month > this.data.month) {
        demo5_days_style.push({ month: 'next', day: date.day, color: 'white', background: '#eb4986' });
      }
      if (date.month < this.data.month) {
        demo5_days_style.push({ month: 'prev', day: date.day, color: 'white', background: '#eb4986' });
      }
      if (date.month == this.data.month) {
        if (date.day == this.data.currentDay.day && date.month == this.data.currentDay.month) {
          demo5_days_style.push({ month: 'current', day: date.day, color: 'white', background: '#46c4f3' });
        } else {
          demo5_days_style.push({ month: 'current', day: date.day, color: 'white', background: '#eb4986' });
        }

      }
    } else {
      demo5_days_style.push({ month: 'prev', day: date.day, color: 'white', background: '#eb4986' });
    }
    this.setData({
      demo5_days_style
    });
  },

  peoAttendance: function () {
    wx.navigateTo({
      url: '/pages/peoAttendance/peoAttendance?isAdmin=staff&data='+JSON.stringify(this.data.user)+'&photo='+this.data.photoUrl,
    })
  },
  peoRecord: function(){
    wx.navigateTo({
      url: '/pages/personRecord/personRecord',
    })
  },
  onLoad: function () {
    var that=this
    const days_count = new Date(this.data.year, this.data.month, 0).getDate();

    demo5_days_style.push({ month: 'current', day: this.data.day, color: 'white', background: '#46c4f3' });

    let currentDay = this.data.currentDay
    let day = [currentDay.year, currentDay.month, currentDay.day].map(util.formatNumber).join('-')
    //某日考勤记录的请求
    wx.request({
      url: app.globalData.server + '/ClockingIn/queryPersonOneDayClockingIn.do?personId=' + app.globalData.staff.id + '&searchDay=' + day,
      method: 'post',
      success: res => {
        this.setData({
          attdenceData: res.data
        })
      }
    })
    //当月考勤记录
    wx.request({
      url: app.globalData.server + '/ClockingIn/queryPersonClockingIn.do?personId=' + app.globalData.staff.id
        + '&&searchMonth=' + util.getCurrentTime().substr(0, 7),
      method: 'post',
      success: res => {
        this.setData({
          monthAtt: res.data
        })
      }
    })

    this.setData({
      demo5_days_style
    });

    this.setData({
      user: app.globalData.staff,
      wxUser: app.globalData.sysWXUser
    })

    //获取人员头像
    wx.request({
      url: app.globalData.server + '/CompareListAction!getById.do?id=' + app.globalData.staff.picId,
      method: 'post',
      success: res => {
        console.log(res)
        that.setData({
          photoUrl: res.data.photoURL
        })
      }
    })
  },
})
