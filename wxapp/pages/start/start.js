// pages/start/start.js
const app = getApp()
var userutil = require('../../utils/userutil.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    gender: 1,
    showablity: false,
    islogin: false
  },
  onLoad: function () {
    var that = this
    if (app.globalData.userInfo == null) { //用户未登录
      app.globalData.userInfo = {
        age: 10,
        avatarUrl: "../../images/head.jpg",
        gender: 1,
        language: "zh_CN",
        lastLoginTime: "2021-01-05T11:15:27.555204463+08:00",
        nickName: "匿名用户",
        nickname: "匿名用户",
        openid: "00001"
      }
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      this.setData({
        islogin: true,
        userInfo: app.globalData.userInfo
      })
    }
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
    
    if(!this.data.userInfo.age ){
      this.openForm()
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '主页'
    })
    var that = this
    util.getLastTest(this.data.userInfo.openid, (res) => {
      if (JSON.stringify(res.data) != "{}") {
        var tempscore = res.data
        var score = [tempscore.plan_score, tempscore.attention_score, tempscore.simul_score, tempscore.suc_score]
        console.log(score)
        that.setData({
          score: score,
          showablity: true
        })
        setTimeout(function () {
          that.setData({
            loading: true
          })
        }, 500)
      }
    })
  },
  myinformation: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  bindViewTap: function () {
    wx.redirectTo({
      url: '/pages/SelfCenter/my/my'
    })
  },
  list: function () {
    wx.redirectTo({
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
        if (app.globalData.userInfo.age > 10) app.globalData.userInfo['ageGroup'] = 1
        else app.globalData.userInfo['ageGroup'] = 0
        if (res.confirm) { //这里是点击了确定以后
          app.globalData.timer = setInterval(function () {
            app.globalData.time += 1
          }, 1000)
          wx.navigateTo({
            url: '/pages/planning-test/rule1/rule1'
          })
        }
      }
    })

  },
  list: function () {
    wx.redirectTo({
      url: '/pages/rank/rank',
    })
  },
  changeinfo: function () {
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
        userInfo: app.globalData.userInfo
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '认知学堂',
      path: '/pages/index/index',
    }
  },
  getUserInfo: function (e) {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        wx.showLoading({
          title: '登录中'
        })
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        userutil.userlogin(res.userInfo)
        userutil.userloginCallback = res => {
          console.log(res.data)
          if (res.data.flag) { //第一次登陆
            app.globalData.userInfo['openid'] = res.data.openid
            wx.setStorage({
              key:"userInfo",
              data:app.globalData.userInfo
            })
            that.openForm()
          } else { //不是第一次登陆
            app.globalData.userInfo = Object.assign(app.globalData.userInfo, res.data)
            wx.setStorage({
              key:"userInfo",
              data:app.globalData.userInfo
            })
            wx.hideLoading()
          }
          that.setData({
            islogin: true,
            userInfo: app.globalData.userInfo
          })
          that.onShow()
        }
        
      }
    })
  },
  openForm: function () {
    this.setData({
      dialogShow: true
    })
    wx.hideLoading()
  },
  
})