// pages/rank/rank.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    options: [{
      city_id: '001',
      city_name: '计划能力排行'
    }, {
      city_id: '002',
      city_name: '注意能力排行'
    }, {
      city_id: '003',
      city_name: '同时性加工排行'
    }, {
      city_id: '004',
      city_name: '继时性加工排行'
    }],
    selected: {}
  },
  change (e) {
    this.setData({
      selected: { ...e.detail }
    })
    wx.showToast({
      title: `${this.data.selected.id} - ${this.data.selected.name}`,
      icon: 'success',
      duration: 1000
    })
  },
  close () {
    // 关闭select
    this.selectComponent('#select').close()
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