// pages/start/start.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSign : true,
    age : 7,
    // nickname : wx.getStorageInfoSync('userInfo').nickname
    nickname:"昵称"
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.setNavigationBarTitle({
    //   title: '首页'
    // })
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