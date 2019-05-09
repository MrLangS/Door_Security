var QR = require("../../utils/qrcode.js");
Page({
  data: {
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
  },

  gotoDevice: function(){
    wx.showModal({
      title: '提示',
      content: '确认已完成设备对生成二维码的扫描？若未完成则会导致绑定失败',
      showCancel: true,
      success: function(res) {
        if(res.confirm){
          wx.switchTab({
            url: '../device/device',
          })
        }
      },
    })
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize();//动态设置画布大小
    if(typeof(options.data)!='undefined'){
      this.createQrCode(options.data, "mycanvas", size.w, size.h);
    }
    
    this.setData({
      clientId: getApp().globalData.admin.clientId,
      regionId: getApp().globalData.admin.regionId,
    })
  },

})