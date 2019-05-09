var pre_checked=[]
Page({

  data: {
    startTime: '08:00',
    endTime: '18:00',
    delay:[0,5,10,15,20,25,30],
    delayMap: { 0:0, 5:1, 10:2, 15:3, 20:4, 25:5, 30:6},
    staIndex: 0,
    endIndex: 0,
    id: 0,
    week: [{ value: '周一', id: 1, checked: true }, { value: '周二', id: 2, checked: true }, { value: '周三', id: 3, checked: true }, { value: '周四', id: 4, checked: true}, 
      { value: '周五', id: 5, checked: true}, { value: '周六', id: 6 }, { value: '周日', id: 7 }],
    hiddenmodal: true,
    checked: [1,2,3,4,5],
    newtag: false,
    groupName:'',
    newRule: true
  },

  onLoad: function (options) {
    var that = this
    this.setData({
      companyId: options.id,
      img: options.img,
      name: options.name
    })
    this.getAttendanceRule(options.id, this)
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          systeminfo: res
        })
      },
    })
  },

  getAttendanceRule(companyId,that){
    //查询考勤规则
    wx.request({
      url: getApp().globalData.server + '/ClockingInConfig/queryClockInRole.do?clientId=' + companyId,
      method: 'post',
      success: res => {
        if (res.data == null) {
          that.setData({
            newtag: true
          })
        } else {
          let data = res.data
          let map = that.data.delayMap
          let week = that.data.week
          let checked = data.workDate.split(',')
          for (var one of week) {
            one.checked = false
          }
          for (var one of checked) {
            week[one - 1].checked = true
          }
          that.setData({
            newRule: false,
            groupName: data.groupName,
            startTime: data.attendanceTime.split(' ')[1].substr(0, 5),
            staIndex: map[data.delayAttendanceTime],
            endTime: data.closingTime.split(' ')[1].substr(0, 5),
            endIndex: map[data.delayClosingTime],
            checked: checked,
            week: week,
            id: data.id
          })
        }
      }
    })
  },

  getGroupName(e){
    this.setData({
      groupName: e.detail.value
    })
  },

  chooseDay: function () {
    var that = this
    if (this.data.hasPopped){
      this.setData({
        hiddenmodal: false,
      })
      pre_checked = [].concat(this.data.checked)
      wx.setStorageSync('preWeek', [].concat(this.data.week))
    }
  },
  cancel: function () {
    console.log(wx.getStorageSync('preWeek'))
    this.setData({
      hiddenmodal: true,
      checked: pre_checked,
      week: [].concat(wx.getStorageSync('preWeek'))
    });
  },
  confirm: function () {
    this.setData({
      hiddenmodal: true,
    })
  },
  //多选
  userCheck: function (e) {
    let index = e.currentTarget.dataset.id;//获取用户当前选中的索引值
    let checkBox = this.data.week;
    if (checkBox[index].checked) {
      checkBox[index].checked = false;
    } else {
      checkBox[index].checked = true;
    }
    this.setData({ week: checkBox })

    //返回用户选中的值
    let value = checkBox.filter((item, index) => {
      return item.checked == true;
    })
    var checked = []
    for (var i = 0; i < value.length; i++) {
      var day = value[i].id
      checked.push(day)
    }
    this.setData({
      checked: checked
    })
  },

  startTimeChange: function(e){
    this.setData({
      startTime: e.detail.value
    })
  },

  endTimeChange: function(e){
    this.setData({
      endTime: e.detail.value
    })
  },

  staDelayTimeChange: function(e){
    this.setData({
      staIndex: e.detail.value
    })
  },

  endDelayTimeChange: function(e){
    this.setData({
      endIndex: e.detail.value
    })
  },
  menuMainMove(e) {
    // 如果已经弹出来了，需要先收回去，否则会受 top、left 会影响
    if (this.data.hasPopped) {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
    var SYSTEMINFO=this.data.systeminfo
    let windowWidth = SYSTEMINFO.windowWidth
    let windowHeight = SYSTEMINFO.windowHeight
    let touches = e.touches[0]
    let clientX = touches.clientX
    let clientY = touches.clientY
    // 边界判断
    if (clientX > windowWidth - 40) {
      clientX = windowWidth - 40
    }
    if (clientX <= 90) {
      clientX = 90
    }
    if (clientY > windowHeight - 40 - 60) {
      clientY = windowHeight - 40 - 60
    }
    if (clientY <= 60) {
      clientY = 60
    }
    let pos = {
      left: clientX,
      top: clientY,
    }
    this.setData({
      pos,
    })
  },
  newRule() {
    var that = this
    this.setData({ newRule: false})
    setTimeout(function () { 
      that.popp()
      that.setData({
        hasPopped: true,
      })
      },1000)
  },

  menuMain() {
    if (!this.data.hasPopped) {
      this.popp()
      wx.showToast({
        title: '现已可编辑',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        hasPopped: true,
      })
    } else {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
  },
  menuOne() {
    
    if(this.data.groupName==''){
      wx.showToast({
        title: '考勤组名称不能为空',
        icon: 'none',
        duration: 1500
      })
      return 
    }
    if(this.data.checked.length==0){
      wx.showToast({
        title: '请选择工作日',
        icon: 'none',
        duration: 1500
      })
      return 
    }
    this.menuMain()
    //设置考勤规则
    let dto={
      clientId: this.data.companyId,
      groupName: this.data.groupName,
      attendanceTime: this.data.startTime,
      closingTime: this.data.endTime,
      delayAttendanceTime: this.data.delay[this.data.staIndex],
      delayClosingTime: this.data.delay[this.data.endIndex],
      workDate: this.data.checked.join(',')
    }
    if(!this.data.newtag){
      dto.id=this.data.id
    }
    wx.request({
      url: getApp().globalData.server + '/ClockingInConfig/saveClockInRole.do',
      data : dto,
      method: 'post',
      success: res => {
        if (typeof (res.data) == 'object'){
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  },
  menuTwo() {
    this.menuMain()
    
  },
  menuThree() {
    this.menuMain()
    this.getAttendanceRule(this.data.companyId, this)
  },
  popp() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    // let animationTwo = wx.createAnimation({
    //   duration: 200,
    //   timingFunction: 'ease-out'
    // })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(360).step()
    animationOne.translate(-40, -40).rotateZ(360).opacity(1).step()
    // animationTwo.translate(-60, 0).rotateZ(360).opacity(1).step()
    animationThree.translate(-40, 40).rotateZ(360).opacity(1).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      //animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
    })
  },
  takeback() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    // let animationTwo = wx.createAnimation({
    //   duration: 200,
    //   timingFunction: 'ease-out'
    // })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(0).step();
    animationOne.translate(0, 0).rotateZ(0).opacity(0).step()
    //animationTwo.translate(0, 0).rotateZ(0).opacity(0).step()
    animationThree.translate(0, 0).rotateZ(0).opacity(0).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      //animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
    })
  },

  
})