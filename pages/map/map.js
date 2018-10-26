// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/images/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/images/location.png'
    }]
  },
  onLoad: function(){
    //实例化API核心类
    qqmapsdk=new QQMapWX({
      key: 'SBXBZ-LG6WV-BXQPQ-UBZQW-ZVZZS-UVBKH'
    })
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  onShow:function(){
    // 调用接口
    qqmapsdk.search({
      keyword: '酒店',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(typeof(res.data[0].location.lat));
      }
    })
    //关键字补全
    qqmapsdk.getSuggestion({
      keyword: '技术',
      success: function (res) {
        console.log(res);
      },
    })
  },

  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  }
})
