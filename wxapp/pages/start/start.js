// pages/start/start.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  onLoad:function(){
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '主页'
    })
    console.log(app.globalData.userInfo)
  },
  myinformation:function(){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  bindViewTap:function(){
    wx.navigateTo({
      url: '/pages/SelfCenter/my/my'
    })
  },

  test:function(){
    //说明测试
    wx.showModal({
      title: '测试PASS',
      content: '欢迎你进入我们的测试，本次测试分为4个部分，分别考察了你的计划、同时性加工、注意和继时性加工能力，由8个小测试组成，大约需要12分钟完成。如果准备好了，就请点击进入测试吧！',
      cancelText:'取消',
      confirmText:'进入测试',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          app.globalData.timer=setInterval(function () { 
            app.globalData.time+=1
          }, 1000)
          wx.navigateTo({
            url: '/pages/Planning/rule1/rule1'
          })
        }
      }
    })
    if(app.globalData.userInfo.age>10) app.globalData.userInfo['ageGroup']=1
    else app.globalData.userInfo['ageGroup']=0
  },
  list:function(){
    wx.navigateTo({
      url: '/pages/rank/rank'
    })
  }
})