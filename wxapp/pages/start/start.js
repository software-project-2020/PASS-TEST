// pages/start/start.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSign : true,
    age : 7,
  },
  onLoad:function(){
    this.setData({
      userInfo:app.globalData.userInfo,
      nickname:app.globalData.userInfo.nickName
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.setNavigationBarTitle({
    //   title: '首页'
    // })
    console.log(app.globalData.userInfo)
  },
  myinformation:function(){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  no_sign:function(){
    this.setData({
      isSign:false
    })
  },
  huizhang_list:function(){
    wx.navigateTo({
      url: '/pages/Planning/rule1/rule1'
    })
  },
  test:function(){
    wx.navigateTo({
      url: '/pages/Planning/rule1/rule1'
    })
  }
})