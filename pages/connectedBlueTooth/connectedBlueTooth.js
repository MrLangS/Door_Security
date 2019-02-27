// pages/connectedBlueTooth/connectedBlueTooth.js
Page({

  data: {
    blueToothes: [{ name: "小米", deviceId: "213212132" }, { name: "小米2", deviceId: "213212132" }],
    refreshImg: '/images/refresh.png'
  },

  refresh(){
    this.startBluetoothDevicesDiscovery()
  },

  /**
   * 开启蓝牙适配
   */
  startConnect: function () {
    var that = this;
    wx.showLoading({
      title: '开启蓝牙适配'
    });
    wx.openBluetoothAdapter({
      success: function (res) {
        /* 获取本机的蓝牙状态 */
        console.log("初始化蓝牙适配器");
        setTimeout(() => {
          that.getBluetoothAdapterState()
        }, 1000)
      },
      fail: function (err) {
        // 初始化失败
        console.log(err);
        wx.showToast({
          title: '蓝牙初始化失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 监听蓝牙状态
   */
  getBluetoothAdapterState: function () {
    var that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        var available = res.available,
          discovering = res.discovering;
        if (!available) {
          wx.showToast({
            title: '设备无法开启蓝牙连接',
            icon: 'success',
            duration: 2000
          })
        }
        else {
          if (!discovering) {
            that.startBluetoothDevicesDiscovery();
            // that.getConnectedBluetoothDevices();
          }
        }
      }
    })
  },

  /**
   * 开始蓝牙搜索
   */
  startBluetoothDevicesDiscovery: function () {
    var that = this;
    wx.showLoading({
      title: '蓝牙搜索'
    });
    wx.startBluetoothDevicesDiscovery({
      services: [],
      allowDuplicatesKey: false,
      success: function (res) {
        console.log("开始蓝牙搜索")
        console.log(res)
        that.getBluetoothDevices()
        // if (!res.isDiscovering) {
        //   that.getBluetoothAdapterState();
        // } else {
        //   that.onBluetoothDeviceFound();
        // }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },

  /**
   * 获取附近的蓝牙设备
   */
  getBluetoothDevices() {
    var that = this;
    setTimeout(() => {
      wx.getBluetoothDevices({
        success: function (res) {
          wx.hideLoading()
          console.log(res)
          
          that.setData({
            blueToothes: res.devices.filter(function (i) { 
              return i.localName != ''&&typeof(i.localName)!='undefined' })
          })

        },
        fail(res) {
          console.log(res, '获取蓝牙设备列表失败=====')
        }
      })
    }, 2000)
  },

  /**
   * 获取已连接蓝牙设备
   */
  getConnectedBluetoothDevices: function () {
    var that = this;
    wx.getConnectedBluetoothDevices({
      services: [that.serviceId],
      success: function (res) {
        console.log("获取处于连接状态的设备", res);
        var devices = res['devices'], flag = false, index = 0, conDevList = [];
        devices.forEach(function (value, index, array) {
          if (value['name'].indexOf('FeiZhi') != -1) {
            // 如果存在包含FeiZhi字段的设备
            flag = true;
            index += 1;
            conDevList.push(value['deviceId']);
            that.deviceId = value['deviceId'];
            return;
          }
        });
        if (flag) {
          this.connectDeviceIndex = 0;
          that.loopConnect(conDevList);
        } else {
          if (!this.getConnectedTimer) {
            that.getConnectedTimer = setTimeout(function () {
              that.getConnectedBluetoothDevices();
            }, 5000);
          }
        }
      },
      fail: function (err) {
        if (!this.getConnectedTimer) {
          that.getConnectedTimer = setTimeout(function () {
            that.getConnectedBluetoothDevices();
          }, 5000);
        }
      }
    });
  },

  /**
   * 发现附近蓝牙设备
   */
  onBluetoothDeviceFound: function () {
    var that = this;
    console.log('onBluetoothDeviceFound');
    wx.onBluetoothDeviceFound(function (res) {
      console.log('new device list has founded')
      console.log(res);
      that.setData({
        blueToothes: res.devices
      })
    })
  },

  onLoad: function (options) {

  },

  onShow: function () {

  },

})