// pages/simultaneous-test/simultaneous-rule/simultaneous-rule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  gototest1: function (e) {

    wx.showModal({
      title: '开始练习',
      content: '在开始测试之前，你有一次练习的机会，练习将不会被计入成绩，快去熟悉一下题目吧!',
      cancelText:'取消',
      confirmText:'开始练习',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.redirectTo({
            url: '/pages/simultaneous-test/test/test',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})