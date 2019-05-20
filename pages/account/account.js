var app = getApp()
Page({

  data: {

  },

  onLoad: function (options) {
    var isAdmin = (1 == options.isAdmin) ? true : false;
    this.setData({
      isAdmin: isAdmin
    })
    if(isAdmin){
      this.setData({
        admins: app.globalData.userSet.users
      })
    }else{
      this.setData({
        staffs: app.globalData.userSet.persons
      })
    }

  },

  onShow: function () {

  },

})