//index.js
var userutil = require('../../utils/userutil.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
    date: '2010-09-01',
    gender: 1,

  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '认知学堂'
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  openForm: function () {
    this.setData({
      dialogShow: true
    })
    wx.hideLoading()
  },
  getUserInfo: function (e) {
    // 先从缓存获取用户数据,无缓存信息将显示匿名用户
    var that = this

    wx.getStorage({
      key: 'userInfo',
      success(res) {
        app.globalData.userInfo=res.data
        wx.redirectTo({
          url: '../start/start'
        })
      },
      fail: (res) => {
        wx.redirectTo({
          url: '../start/start'
        })
      }
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
      wx.redirectTo({
        url: '../start/start'
      })
    })
  },
  radioChange: function (e) {
    this.setData({
      gender: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '认知学堂',
      path: '/pages/index/index',
    }
  }
})