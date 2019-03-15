var globalData = getApp().globalData
var app=getApp()
var pre_checkedDev = []
var pre_checkedId = []
var util = require("../../../utils/util.js")
Page({

  data: {
    items: [],
    arr: [],
    startX: 0, //开始坐标
    startY: 0,
    noResult: false,
    pageNum: 1,
    isTouchMove: false,
    devices: [],
    pre_devices: [],
    hiddenmodal: true,
    choosedDEV: [],
    checkedDev: [],
    checkedId: [],
    choosedId: [],
  },

  formSubmit(e){
    let formId = e.detail.formId
    
    //执行相应的事件
    let type = e.detail.target.dataset.type
    this.setItemsChecked(type)
    //筛选已选择项的id
    let arr = this.data.items.filter( e => { return e.checked==true}).map(function(e){ return e.id })
    console.log(arr)
    this.setData({
      arr : arr
    })

    //将formId添加到全局数组中
    //globalData.formIds.push(formId)
    
  },

  accept(){
    
    //globalData.formIds.length=0
  },

  reject(){
    //未通过审核
    var that = this
    if (this.data.arr.length){
      wx.request({
        url: app.globalData.server + '/TransitPerson/approvalPersonnel.do',
        data: {
          auditStatus: 0,
          userName: app.globalData.admin.userName,
          personIds: this.data.arr
        },
        method: 'post',
        success: function (res) {
          var list=res.data
          if (list.length){
            wx.showToast({
              title: '拒绝成功',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              arr: []
            })
            that.reload(true)
            
            for(var one of list){
              //发送模版消息
              wx.request({
                url: app.globalData.server + '/SysWXUserAction/sendTemplateMessage.do',
                data: {
                  openId: one.openid, // oxBGp5U9n8kT8wxhxCI59XqNg9hw
                  formId: one.formid,
                  templateId: 'VM72gcZpduGU5gxLfySyPdr6o7_19n5OEzE-O1NrqhQ',
                  Data: {
                    keyword1: { value: '抱歉，您的申请失败了' },
                    keyword2: { value: app.globalData.admin.userName },
                    keyword3: { value: app.globalData.admin.phoneNum },
                    keyword4: { value: util.getCurrentTime() },
                    keyword5: { value: '如有疑问可联系相应管理员' }
                  }
                },
                method: 'post',
                success: res => {
                  console.log('发送模版消息结果：')
                  console.log(res)
                }
              })
            }
            
          }
        }
      })

      
    }else{
      wx.showToast({
        title: '当前尚未选择',
        icon: 'none',
        duration:1000
      })
    }
  },

  chooseDev: function () {
    var that = this
    if (this.data.arr.length) {
      this.setData({
        hiddenmodal: false
      })
      this.setData({
        pre_devices: this.data.devices
      })
      pre_checkedDev = [].concat(this.data.checkedDev)
      pre_checkedId = [].concat(this.data.checkedId)
    } else {
      wx.showToast({
        title: '当前尚未选择',
        icon: 'none',
        duration: 1000
      })
    }
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
      devices: this.data.pre_devices,
      checkedDev: pre_checkedDev,
      checkedId: pre_checkedId
    });
  },
  confirm: function () {
    var that=this
    this.setData({
      hiddenmodal: true,
      choosedDEV: this.data.checkedDev,
      choosedId: this.data.checkedId
    })

    //审核通过
    wx.request({
      url: app.globalData.server + '/TransitPerson/approvalPersonnel.do',
      data: {
        auditStatus: 1,
        userName: app.globalData.admin.userName,
        personIds: this.data.arr,
        devIds: this.data.choosedId
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        var list = res.data

        if (list.length) {
          wx.showToast({
            title: '接受成功',
            icon: 'success',
            duration: 1500
          })
          that.setData({
            arr: []
          })
          that.reload(true)
          
          for (var one of list) {
            //发送模版消息
            wx.request({
              url: app.globalData.server + '/SysWXUserAction/sendTemplateMessage.do',
              data: {
                openId: one.openid, // oxBGp5U9n8kT8wxhxCI59XqNg9hw
                formId: one.formid,
                templateId: 'VM72gcZpduGU5gxLfySyPdr6o7_19n5OEzE-O1NrqhQ',
                Data: {
                  keyword1: { value: '您的申请已通过' },
                  keyword2: { value: app.globalData.admin.userName },
                  keyword3: { value: app.globalData.admin.phoneNum },
                  keyword4: { value: util.getCurrentTime() },
                  keyword5: { value: '现可刷脸通行相应设备' }
                }
              },
              method: 'post',
              success: res => {
                console.log('发送模版消息结果：')
                console.log(res)
              }
            })
          }
        }
      }
    })

  },
  //多选
  userCheck: function (e) {
    let index = e.currentTarget.dataset.id;//获取用户当前选中的索引值
    let checkBox = this.data.devices;
    if (checkBox[index].checked) {
      this.data.devices[index].checked = false;
    } else {
      this.data.devices[index].checked = true;
    }
    this.setData({ devices: this.data.devices })

    //返回用户选中的值
    let value = checkBox.filter((item, index) => {
      return item.checked == true;
    })
    var checkedDev = []
    var checkedId = []
    for (var i = 0; i < value.length; i++) {
      var item = value[i].devName
      var itemId = value[i].devId
      checkedDev.push(item)
      checkedId.push(itemId)
    }
    this.setData({
      checkedDev: checkedDev,
      checkedId: checkedId
    })
  },

  setItemsChecked(index){
    let items = this.data.items
    items[index].checked=items[index].checked==true? false : true
    this.setData({
      items : items
    })
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
        items: []
      })
    }
    wx.request({
      url: getApp().globalData.server + '/TransitPerson/getUnauditedPersons.do',
      data: {
        clientId: app.globalData.admin.clientId,
        pageIndex: that.data.pageNum - 1,
      },
      method: 'post',
      success: (res) => {
        
        let list = res.data.persons
        if (list.length) {
          let pageNum = this.data.pageNum + 1
          this.setData({
            pageNum,
            items: reload ? list : this.data.items.concat(list),
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
          } else {
            this.setData({
              items: [],
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

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      isTouchMove =false,
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    if (Math.abs(angle) > 30) return;

    if (touchMoveX > startX) //右滑
      isTouchMove = false
    else //左滑
      isTouchMove = true
    //更新数据
    that.setData({
      isTouchMove: isTouchMove
    })
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

  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  onLoad: function (options) {
    this.init(true)

    wx.request({
      url: app.globalData.server + '/DoorDevice/getClientDevices.do?clientId=' + app.globalData.admin.clientId,
      method: 'post',
      success: (res) => {
        this.setData({
          devices: res.data
        })
      }
    })
  },

  onPullDownRefresh: function () {
    this.reload(true)
  },

  onReachBottom: function () {
    if (!this.data.items.length || !this.data.noResult) {
      this.getList()
    }
  },
})