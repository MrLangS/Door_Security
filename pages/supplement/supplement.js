// pages/supplement/supplement.js
Page({

  data: {
    starttime: '08:00',
    endtime: '18:00',
    peos:['小明','小红','小亮'],
    index: 0
  },

  bindTimeChange: function(e){
    this.setData({
      starttime: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      endtime: e.detail.value
    })
  },
  bindPersonChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  submit: function(e) {
    console.log(e)
  },

  onLoad: function (options) {

  },

})