//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  globalData: {
    sysWXUser: null,
    openid: null,
    isMajorUser: false,
    // server: 'http://192.168.0.251:8080/ebank',
    // server: 'https://doorcontrol.faceos.com/FaceMonitorWeb',
    server: 'http://192.168.0.161:8080/ebank',
    // server: 'https://doortest.faceos.com',
    admin: null
  }
})