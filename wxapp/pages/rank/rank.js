const app = getApp()
Page({
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
    all_number: 2,
    my_score : 80,
    my_rank: 10,
    ranklist: [{
      "rank":1,
      "nick_name":"用户1",
      "score": 100
    }, {
      "rank":2,
      "nick_name":"用户2",
      "score": 90
    }, {
      "rank":3,
      "nick_name":"用户3",
      "score": 86
    }, {
      "rank":4,
      "nick_name":"用户4",
      "score": 77
    }, {
      "rank":5,
      "nick_name":"用户5",
      "score": 98
    }, {
      "rank":6,
      "nick_name":"用户6",
      "score": 45
    }, 
    // {
    //   "rank":7,
    //   "nick_name":"用户7",
    //   "score": 87
    // }, {
    //   "rank":8,
    //   "nick_name":"用户8",
    //   "score": 80
    // }, {
    //   "rank":9,
    //   "nick_name":"用户9",
    //   "score": 17
    // }, {
    //   "rank":10,
    //   "nick_name":"用户10",
    //   "score": 100
    // }, {
    //   "rank":11,
    //   "nick_name":"用户11",
    //   "score": 120
    // }, {
    //   "rank":12,
    //   "nick_name":"用户12",
    //   "score": 234
    // }
  ],
    selected: {},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userrank: 0,
    userscore: 0,
    pagenum: 1,
    allpages: 0
  },
  change(e) {
    this.setData({
      selected: { ...e.detail }
    })
    wx.showToast({
      title: `${this.data.selected.id} - ${this.data.selected.name}`,
      icon: 'success',
      duration: 1000
    })
  },
  close() {
    // 关闭select
    this.selectComponent('#select').close()
  },

  onLoad: function (options) {
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
    var that = this
    wx.request({
      url: 'https://app.morii.top/login',
      method: 'GET',
      data: {
        pages: this.data.pagenum
      },
      success: function (res) {
        // success
        console.log('submit success');
        that.setData({
          ranklist: res.data.ranks,
          allpages: res.data.allpages
        })
      }
    })
    wx.request({
      url: 'https://app.morii.top/userRank',
      method: 'GET',
      data: {
        username: this.data.userInfo.nickName
      },
      success: function (res) {
        console.log('submit success');
        that.setData({
          userrank: res.data.rank,
          userscore: res.data.score
        })
        wx.setStorageSync('endlessScore', res.data.score)
      }
    })
  },

  pre: function () {
    this.setData({
      pagenum: this.data.pagenum - 1
    })
    this.onLoad();
  },
  next: function () {
    this.setData({
      pagenum: this.data.pagenum + 1
    })
    this.onLoad();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})