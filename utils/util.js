var app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getCurrentTime(){
  return formatTime(new Date())
}

var app=getApp()
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const JsonToArray = json => {
  var arr=[]
  for(var j in json){
    arr.push(json[j])
  }
  return arr
}
function checkCode(that) {
  if (that.data.code == "") {
    wx.showToast({
      title: '验证码不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (that.data.code != that.data.iscode) {
    wx.showToast({
      title: '验证码错误',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
//获取日期
function getPicker(tag) {
  const date = new Date()
  if (tag == 'year') {
    return date.getFullYear()
  } else if (tag == 'month') {
    return date.getMonth() + 1
  } else if (tag == 'day') {
    return date.getDate()
  } else if (tag == 'arr') {
    return [date.getFullYear() - 2017, date.getMonth()]
  } else if (tag == 'hour') {
    return date.getHours()
  } else if (tag == 'minute') {
    return date.getMinutes()
  }
}
//获取日期列表
function getPickerList(tag) {
  const years = []
  const months = []
  const days = []
  const nums = []
  for (let i = 2017; i <= 2048; i++) {
    years.push(i)
  }
  for (let i = 1; i <= 12; i++) {
    months.push(i)
  }
  for (let i = 1; i <= 31; i++) {
    days.push(i)
  }
  for (let i = 1; i <= 20; i++) {
    nums.push(i)
  }
  if (tag == 'years') {
    return years
  } else if (tag == 'months') {
    return months
  } else if (tag == 'days') {
    return days
  } else if (tag == 'nums') {
    return nums
  }
}
function checkPhone(that) {
  var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/;
  if (that.data.phoneNumber == "") {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (!myreg.test(that.data.phoneNumber)) {
    wx.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkImage(that) {
  if (that.data.quality == 1) {
    wx.showToast({
      title: '需添加本人清晰头像',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkUsername(that) {
  if (that.data.username.trim() == "") {
    wx.showToast({
      title: '用户名不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkCompname(that) {
  if (that.data.company == "" || that.data.company == "选择单位") {
    wx.showToast({
      title: '单位名称不能为空',
      icon: 'none',
      duration: 1000
    })
    return false
  } else {
    return true
  }
}
function checkPhone01(phone) {
  var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/;
  if (phone == "") {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (!myreg.test(phone)) {
    wx.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkName(name) {
  if (name == "") {
    wx.showToast({
      title: '人员名称不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkAvatar(that) {
  if (that.data.avatar == "") {
    wx.showToast({
      title: '请添加人员头像',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkDevice(that) {
  if (that.data.choosedDEV.length == 0) {
    wx.showToast({
      title: '请选择设备',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkEmail(email) {
  var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
  if (email!='' && !reg.test(email)) {
    wx.showToast({
      title: '邮箱格式不正确',
      icon: 'none',
      duration: 1500,
    })
    return false
  }
  return true
}
let isEmptyObject = (obj) => {
  for (let i in obj) {
    return false
  }
  return true
}
function checkStaffForm(that,name,phone,email){
  if(that.data.tag){
    return checkName(name) && checkPhone01(phone)
  }else{
    return checkAvatar(that) && checkName(name) && checkEmail(email) && checkDevice(that)
  }
}
//表单验证
function checkForm(that,tag) {
  var checked = false
  switch(tag) {
    case 0:
      checked = checkImage(that) && checkPhone(that) && checkCode(that);
      break;
    case 1:
      checked = checkPhone(that) && checkCode(that);
      break;
    case 2:
      checked = checkImage(that) && checkPhone(that) && checkCode(that) && checkUsername(that) && checkCompname(that);
      break;
    case 3:
      checked = checkImage(that) && checkUsername(that) && checkCompname(that) && checkPhone(that) && checkCode(that);
      break;
    case 999:
      checked = true;
      break;
    default: 
      checked = checkImage(that) && checkUsername(that) && checkCompname(that);
      break;
  }
  return checked
}
//获取验证码
function getCode(that,isExist) {
  if (checkPhone(that)) {
    if (isExist && !that.data.isEmpty){
      wx.showToast({
        title: '请修改手机号!',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var endPhone = that.data.phoneNumber.substr(7, 4)
    that.setData({
      disabled: true
    })
    wx.request({
      url: getApp().globalData.server + "/SysWXUserAction/sendVerificationCode.do?phoneNo=" + that.data.phoneNumber,
      data: {},
      method: 'post',
      success(res) {
        console.log(res)
        that.setData({
          iscode: res.data.code
        })
        wx.showToast({
          title: '已向尾号' + endPhone + '的手机成功发送验证码',
          icon: 'none',
          duration: 1500
        })
        var num = 61;
        var timer = setInterval(function () {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            that.setData({
              codename: '发送验证码',
              disabled: false
            })

          } else {
            that.setData({
              codename: "重发 (" + num + "s)"
            })
          }
        }, 1000)
      }
    })
  }
}

function login2getId(isSubAdmin) {
  var encryptedData = null
  var iv = null
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unio
      var code = res.code

      if (code) {
        console.log('获取用户登录凭证：' + code);
        wx.getUserInfo({
          success: function (res) {
            encryptedData = res.encryptedData
            iv = res.iv
            //用户已经授权过
            var loginUrl = getApp().globalData.server + '/SysWXUserAction/onLogin.do';
            // --------- 发送凭证 ------------------
            wx.request({
              url: loginUrl,
              data: {
                code: code,
                encryptedData: encryptedData,
                iv: iv,
                userType: '3'
              },
              method: 'post',
              success: function (res) {
                var openid = res.data.openid //返回openid
                console.log("openid is: " + openid);
                console.log("realopenid is: " + res.data.miniproId);
                app.globalData.openid = openid
                app.globalData.realOpenid = res.data.miniproId
                var wxUser = res.data.sysWXUser
                
                if (isSubAdmin){
                  if (wxUser) {
                    console.log('wxUser:')
                    console.log(wxUser)
                    app.globalData.sysWXUser = wxUser
                    var type = wx.getStorageSync('isAdmin')
                    if (1 == type){
                      var userId = wx.getStorageSync('userId')
                      
                      wx.request({
                        url: getApp().globalData.server + '/SysWXUserAction/checkPersonStatus.do?id=' + userId + '&type=' + type,
                        method: 'post',
                        success: res => {
                          console.log('User:')
                          console.log(res)

                          app.globalData.admin = res.data.user
                          app.globalData.isAdmin = true
                          app.globalData.isMajorUser = res.data.isMajorUser
                          wx.switchTab({
                            url: '../company/company',
                          })
                        }
                      })
                    }
                    
                  }
                }
              },
              fail: function () {
                wx.showToast({
                  title: '网络异常!',
                  icon: 'none',
                  duration: 2000
                })
                console.log("fail")
              }
            })
          }
        })

      } else {
        console.log('获取用户登录态失败：' + res.errMsg);
      }
    }
  })

}

function redotListener(){
  wx.request({
    url: app.globalData.server + '/TransitPerson/getUnauditedPersons.do',
    data: {
      clientId: app.globalData.admin.clientId,
      pageIndex: 0
    },
    method: 'post',
    success: function (res) {
      
      if(res.data.totalCount){
        wx.showTabBarRedDot({
          index: 0,
        })
      }
    }
  })
}

function login(isSubAdmin) {
  var encryptedData=null
  var iv=null
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = res.code
      
      if (code) {
        console.log('获取用户登录凭证：' + code);
        wx.getUserInfo({
          success: function (res) {
            encryptedData = res.encryptedData
            iv = res.iv
            //用户已经授权过
            var loginUrl = getApp().globalData.server + '/SysWXUserAction/onLogin.do';
            // --------- 发送凭证 ------------------
            wx.request({
              url: loginUrl,
              data: {
                code: code,
                encryptedData: encryptedData,
                iv: iv,
                userType: '3'
              },
              method: 'post',
              success: function (res) {
                var openid = res.data.openid //返回openid
                console.log("openid is: " + openid);
                console.log("realopenid is: " + res.data.miniproId);
                app.globalData.openid = openid
                app.globalData.realOpenid = res.data.miniproId
                var wxUser = res.data.sysWXUser
                if(wxUser) {
                  console.log('wxUser:')
                  console.log(wxUser)
                  app.globalData.sysWXUser = wxUser
                  var userId = wx.getStorageSync('userId')
                  if(userId) {
                    var type = wx.getStorageSync('isAdmin')
                    wx.request({
                      url: getApp().globalData.server + '/SysWXUserAction/checkPersonStatus.do?id=' + userId + '&type=' + type,
                      method: 'post',
                      success: res=>{
                        console.log('User:')
                        console.log(res)
                        if(type == 1){// 1为管理员
                          app.globalData.admin = res.data.user
                          app.globalData.isAdmin = true
                          app.globalData.isMajorUser = res.data.isMajorUser
                          wx.switchTab({
                            url: '../company/company',
                          })
                        } else {
                          app.globalData.isAdmin = false
                          app.globalData.staff = res.data.person
                          wx.reLaunch({
                            url: '../index/index',
                          })
                        }
                        
                      }
                    })
                    
                  }else{
                    wx.redirectTo({
                      url: '../role/role',
                    })
                  }
                } else {
                  console.log('未拥有微信用户')
                  wx.redirectTo({
                    url: '../role/role',
                  })
                }
              },
              fail: function () {
                wx.showToast({
                  title: '网络异常，请刷新重试!',
                  icon:'none',
                  duration: 2000
                })
                console.log("fail")
              }
            })
          }
        })

      } else {
        console.log('获取用户登录态失败：' + res.errMsg);
      }
    }
  })
  
}
function registerWxUser(userId,type){
  wx.request({
    url: getApp().globalData.server + '/SysWXUserAction/checkPersonStatus.do?id=' + userId + '&type=' + type,
    method: 'post',
    success: res => {
      console.log('User:')
      console.log(res)
      var admin = res.data.user
      if (admin) {
        app.globalData.admin = admin
        app.globalData.isAdmin = true
        app.globalData.isMajorUser = res.data.isMajorUser
        //判断有没有微信用户，不存在的话重新注册
        if (!app.globalData.sysWXUser) {
          console.log('注册微信用户')
          wx.request({
            url: app.globalData.server + "/SysWXUserAction/recoverUser.do",
            data: {
              userId: admin.id,
              openId: app.globalData.openid,
              miniproId: app.globalData.realOpenid
            },
            method: 'post',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res)
              if (res.data.msg == 'ok') {
                app.globalData.sysWXUser = res.data.sysWXUser
                wx.switchTab({
                  url: '../company/company',
                })
                wx.showToast({
                  title: '请您在“我的”中完善头像！',
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none',
                  duration: 1500
                })
              }
              if(!res.data.msg){
                wx.showToast({
                  title: '登录失败',
                  icon: 'none',
                  duration: 1500
                })
              }
            },
          })
        } else {
          wx.switchTab({
            url: '../company/company',
          })
        }
      } else {
        wx.showToast({
          title: '该用户尚未注册!',
          icon: 'none',
          duration: 1500
        })
      }
    }
  })
}
function formatDay(that) {
  var date = that.data
  return [date.year, date.month, date.day].map(formatNumber).join('-')
}
module.exports = {
  formatTime: formatTime,
  getCode: getCode,
  formatNumber: formatNumber,
  checkForm: checkForm,
  checkEmail: checkEmail,
  JsonToArray: JsonToArray,
  getCurrentTime: getCurrentTime,
  login: login,
  login2getId: login2getId,
  checkStaffForm: checkStaffForm,
  isEmptyObject: isEmptyObject,
  getPicker: getPicker,
  getPickerList: getPickerList,
  redotListener: redotListener,
  registerWxUser: registerWxUser,
  formatDay: formatDay
}
