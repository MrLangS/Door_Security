Page({

  data: {

  },

  goToAdminLogin: function(){
    wx.navigateTo({
      url: '../login/login?isAdmin='+1,
    })
  },

  goToStaffLogin: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  onLoad: function (options) {

  },

})