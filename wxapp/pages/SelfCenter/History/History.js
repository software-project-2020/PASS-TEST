// pages/SelfCenter/History/History.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['2020', '2021'],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    month: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]],
    musicIsPlay: true,
    TestYear: null,
    TestMonth: null,
    selectList: [{"text": "2020"}, {"text": "2021"}],
    select: false,
    select_value1: {
      "text": "未选择"
    },
    record:[{"testyear":2021,"testmonth":1,"testday":22,"testtime":"13:45","testscore":90,"isBest":true},
    {"testyear":2020,"testmonth":12,"testday":12,"testtime":"20:30","testscore":89,"isBest":false},
    {"testyear":2020,"testmonth":12,"testday":8,"testtime":"19:50","testscore":87,"isBest":false},
    {"testyear":2020,"testmonth":7,"testday":19,"testtime":"09:00","testscore":78,"isBest":false},
    {"testyear":2020,"testmonth":6,"testday":29,"testtime":"17:50","testscore":70,"isBest":false}],
    newrecord:[],
    top : 0,
    now : ''
  },
  choosemonth(e) {
    this.setData({
      TestMonth: e.currentTarget.dataset.item
    })
    this.renew()
  },
  changemusic() {
    var musicIsPlay = this.data.musicIsPlay
    this.setData({
      musicIsPlay: !musicIsPlay
    })
    // console.log(this.data.musicIsPlay)
  },
  goback() {
    wx.navigateTo({
      url: '/pages/SelfCenter/my/my',
    })
  },
  renew(){
    var record = this.data.record.slice()
    var newrecord = [];
    for(var i =0 ;i<record.length;i++){
      if(record[i].testmonth==this.data.TestMonth&&record[i].testyear==this.data.TestYear){
        var item={
          "testyear":record[i].testyear,
          "testmonth":record[i].testmonth,
          "testday":record[i].testday,
          "testtime":record[i].testtime,
          "testscore":record[i].testscore,
          "isBest":record[i].isBest
        }
        newrecord.push(item)
      }
    }
    this.setData({
      newrecord:newrecord
    })
  }
  ,
  m_select_touch(e) {
    let that = this;
    let selectIndex = e.detail.selIndex;
    let value1 = that.data.selectList[selectIndex];
    that.setData({
      select_value1: value1,
      TestYear: value1.text
    })
    // console.log(this.data.TestYear)
    this.renew()
  },

   //scroll滚动时触发
   scroll(evt){
    //console.log(evt);
    let scrollTop = evt.detail.scrollTop;
    let now = scrollTop >= 100 ? 'now' : '';
    this.setData({
      scrollTop,
      now
    });
  },
  GotoRecord(){

  }

})