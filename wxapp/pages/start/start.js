// pages/start/start.js
const app = getApp()
var userutil = require('../../utils/userutil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    oneButton: [{
      text: '确定'
    }],
    items: [{
      name: '1',
      value: '男',
      checked: 'true'
    },
    {
      name: '2',
      value: '女'
    }
  ],
    date: '2016-09-01',
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    if (app.globalData.userInfo.age > 10) app.globalData.userInfo['ageGroup'] = 1
    else app.globalData.userInfo['ageGroup'] = 0
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
  myinformation: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '/pages/SelfCenter/my/my'
    })
  },
  list: function () {
    wx.navigateTo({
      url: '../rank/rank'
    })
  },

  test: function () {
    //说明测试
    wx.showModal({
      title: '测试PASS',
      content: '欢迎你进入我们的测试，本次测试分为4个部分，分别考察了你的计划、同时性加工、注意和继时性加工能力，由8个小测试组成，大约需要12分钟完成。如果准备好了，就请点击进入测试吧！',
      cancelText: '取消',
      confirmText: '进入测试',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          app.globalData.timer = setInterval(function () {
            app.globalData.time += 1
          }, 1000)
          wx.navigateTo({
            url: '/pages/Planning/rule1/rule1'
          })
        }
      }
    })
   
  },
  list:function(){
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },
  changeinfo:function(){
    this.setData({
      dialogShow: true
    })
   
  },
  tapDialogButton(e) {
    app.globalData.userInfo['birthday'] = this.data.date
    app.globalData.userInfo['gender'] = this.data.gender
    userutil.personalInfo(app.globalData.userInfo, (res) => {
      //年龄放入userinfo
      app.globalData.userInfo['age'] = res.data.age
      console.log(app.globalData.userInfo)
      wx.setStorageSync('userInfo', Object.assign(app.globalData.userInfo, {
        'birthday': this.data.date,
        'gender': this.data.gender,
      }))
      
      this.setData({
        dialogShow: false
      })
      this.setData({
        userInfo:app.globalData.userInfo
      })
    })
    
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      gender: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
})