// pages/zyy_memory_span/rule/rule.js
Page({
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '注意'
    })
  },
  goTest: function (e) {
    wx.showModal({
      title: '开始练习',
      content: '在开始测试之前，你有一次练习的机会，快去熟悉一下题目吧!',
      cancelText: '跳过练习',
      confirmText: '练习一下',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          wx.navigateTo({
            url: '/pages/zyy_memory_span/test/test',
          })
        } else {
          wx.navigateTo({
            url: '/pages/zyy_memory_span/memory_span',
          })
        }
      }
    });
  },
});