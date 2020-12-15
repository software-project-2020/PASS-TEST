var rankutil = require('../../utils/rankutil')
const app = getApp()
Page({
  data: {
    options: [{
      rank_id: '001',
      rank_name: '计划能力排行',
      type: 'P'
    }, {
      rank_id: '002',
      rank_name: '注意能力排行',
      type: 'A'
    }, {
      rank_id: '003',
      rank_name: '同时性加工排行',
      type: 'S1'
    }, {
      rank_id: '004',
      rank_name: '继时性加工排行',
      type: 'S2'
    }],
    all_number: 2,
    my_score: 80,
    my_rank: 10,
    ranklist: [{
      "rank": 1,
      "nick_name": "用户1",
      "score": 100
    }, {
      "rank": 2,
      "nick_name": "用户2",
      "score": 90
    }, {
      "rank": 3,
      "nick_name": "用户3",
      "score": 86
    }, {
      "rank": 4,
      "nick_name": "用户4",
      "score": 77
    }, {
      "rank": 5,
      "nick_name": "用户5",
      "score": 98
    }, {
      "rank": 6,
      "nick_name": "用户6",
      "score": 45
    },
      //  {
      //   "rank":7,
      //   "nick_name":"用户7",
      //   "score": 87
      // }, 
      // {
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
      selected: { ...e.detail },
      ranklist: res.data.ranks,
    })
    // wx.showToast({
    //   title: `${this.data.selected.id} - ${this.data.selected.name}`,
    //   icon: 'success',
    //   duration: 1000
    // })
    this.onLoad();
  },
  close() {
    // 关闭select
    this.selectComponent('#select').close()
  },

  onLoad: function (options) {
    rankutil.getRanklists(app.globalData.userInfo.openid, app.globalData.userInfo.age,)
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
  }
})