const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

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
function checkPhone(that) {
  var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
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
      title: '照片须为本人清晰头像',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkUsername(that) {
  if (that.data.username == "") {
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
//表单验证
function checkForm(that,tag) {
  if(tag==0){
    if (checkPhone(that) && checkCode(that)) {
      return true
    } else {
      return false
    }
  }else{
    if (checkImage(that) && checkUsername(that)) {
      return true
    } else {
      return false
    }
  }
  
}
//获取验证码
function getCode(that) {
  var endPhone = that.data.phoneNumber.substr(7, 4)
  if (checkPhone(that)) {
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
module.exports = {
  formatTime: formatTime,
  getCode: getCode,
  checkForm: checkForm,
  JsonToArray: JsonToArray
}
