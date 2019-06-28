var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  test(){
    wx.request({
      url: app.globalData.server + '/SysWXUserAction/sendUniMsg.do',
      data: {
        openId: 'ojahH42rt3xmwmriB9Q5hxmSwRJs',
        miniAppid: app.globalData.config.miniAppid,
        templateId: app.globalData.config.joinTemplateId,
        dto: {
          first: { value: '申请加入'},
          keyword1: { value: '名字' },
          keyword2: { value: '时间' },
          remark: { value: '请相应管理员尽快处理' }
        }
      },
      method: 'post',
      success: res => {
        console.log(res)
      }
    })
  },
})