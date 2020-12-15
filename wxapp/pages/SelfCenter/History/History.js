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
    isBest:[],
    record:[
    {"testtime":"2021-01-31 12:15","testscore":95},
    {"testtime":"2021-01-02 15:50","testscore":99},
    {"testtime":"2021-01-02 12:45","testscore":89},
    {"testtime":"2021-01-02 13:45","testscore":87},
    {"testtime":"2021-01-02 13:45","testscore":77},],
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
    if(this.data.TestYear==2021&&this.data.TestMonth==1)
    for(var i =0 ;i<record.length;i++){
        var item={
          "testtime":record[i].testtime,
          "testscore":record[i].testscore,
          "isBest":record[i].isBest
        }
        newrecord.push(item)
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

  },
  onLoad: function () {
    var record = this.data.record
    var best=0;
    for(var i=0;i<record.length;i++){
      record[i].isBest=false
      if(best<=record[i].testscore){
        best=record[i].testscore
      }
    }
    for(var i=0;i<record.length;i++)
      if(best==record[i].testscore)
      record[i].isBest=true
    console.log(this.data.record)
  },

})