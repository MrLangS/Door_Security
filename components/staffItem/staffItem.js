// components/staffItem/staffItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigatItem(e) {
      var items = this.data.list
      for (var i = 0; i < items.length; i++) {
        items[i].isTouchMove = false //默认隐藏删除
      }
      this.setData({
        list: items
      });
      wx.navigateTo({
        url: `/pages/contentPEO/contentPEO?data=${JSON.stringify(this.data.list[e.currentTarget.dataset.index])}`,
      })
    },
  }
})
