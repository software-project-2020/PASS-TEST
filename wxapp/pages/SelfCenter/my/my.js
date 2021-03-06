// pages/SelfCenter/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  home:function(e){
    wx.redirectTo({
      url: '/pages/start/start',
      })
  },
  rank:function(e){
    wx.redirectTo({
      url: '/pages/rank/rank',
      })
  },
  gotoHistoryTest:function(e){
    wx.navigateTo({
      url: '/pages/SelfCenter/History/History',
      })
  },
  gotoSuggestions:function(e){
    wx.navigateTo({
      url: '/pages/SelfCenter/suggestion/suggestion',
      })
  },
  gotoAboutUs:function(e){
    wx.navigateTo({
      url: '/pages/SelfCenter/aboutus/aboutus',
      })
  },
  goback:function(e){
    wx.navigateTo({
      url: '/pages/SelfCenter/aboutus/aboutus',
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    this.setData({
      userInfo:app.globalData.userInfo
    })
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
    return {
      title: '认知学堂',
      path: '/pages/index/index',
    }
  },
})