// pages/attention/attention.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '注意'
    })
  },

  button_start:function(){
    wx.redirectTo({
      url: '../game2/attention_game'
    })
  }
})