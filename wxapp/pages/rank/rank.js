var rankutil = require('../../utils/rankutil')
const app = getApp()
Page({
  data: {
    options: [{
      rank_id: '001',
      rank_name: '计划能力排行',
      rank_type: 'P'
    }, {
      rank_id: '002',
      rank_name: '注意能力排行',
      rank_type: 'A'
    }, {
      rank_id: '003',
      rank_name: '同时性加工排行',
      rank_type: 'S1'
    }, {
      rank_id: '004',
      rank_name: '继时性加工排行',
      rank_type: 'S2'
    }],
    rank_list: {},
    // choosed: [false, false, false, false,false],
    choosed: [true, false, false, false, false],
    type: ['T', 'P', 'A', 'S1', 'S2'],
    // ranktype: null,
    ranktype: 'T',
    all_number: 2,
    my_score: 80,
    my_rank: 10,
    selected: {},
    userrank: 0,
    userscore: 0,
    pagenum: 1,
    allpages: 0
  },
  choose: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var flag = this.data.choosed;
    var i;
    for (i = 0; i < 5; i++) {
      if (i != index)
        flag[i] = false;
      else
        flag[i] = true;
    }
    this.setData({
      ranktype: this.data.type[index],
      choosed: flag
    })
    this.onLoad()
    console.log(this.data.ranktype)
  },
  onLoad: function (options) {
    this.setData({
      headimg: getApp().globalData.userInfo.avatarUrl
    })
    var that = this
    rankutil.getRanklists(app.globalData.userInfo.openid, app.globalData.userInfo.age, this.data.ranktype, this.data.pagenum, 6, (res) => {
      that.setData({
        all_number: res.data.all_number,
        my_score: res.data.my_score,
        my_rank: res.data.my_rank,
        rank_list: res.data.rank_list
      })
      console.log(res.rank_list)
    })
    console.log(this.data.ranklist)
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