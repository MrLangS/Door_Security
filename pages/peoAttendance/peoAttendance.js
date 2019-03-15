
Page({

  data: {

  },

  onLoad: function (options) {
    if (typeof (options.data) != "undefined") {
      var json = JSON.parse(options.data)
      var arr = [json.person.photoURL, json.person.personName, json.person.phoneNo]
      this.setData({
        peo: json,
        dataArr: arr
      })
    }
  },

})