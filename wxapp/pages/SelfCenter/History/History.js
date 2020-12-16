// pages/SelfCenter/History/History.js
var testutil = require('../../../utils/testutil.js')
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
    TestTime:null,
    TestScore:null,
    TestId:null,
    selectList: [{"text": "2020"}, {"text": "2021"}],
    select: false,
    select_value1: {
      "text": "未选择"
    },
    isBest:[],
    record:[],
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
    if(this.data.TestYear!=null&&this.data.TestMonth!=null){
      this.setData({
        record:[]
      })
      var recorddata={
        // openid:getApp().globalData.userInfo.openid,
        openid:"oAkCq5aL-90X9qhtwEDR8lx2TMZA",
        testyear:this.data.TestYear,
        testmonth:this.data.TestMonth
      }
      // console.log(JSON.stringify(recorddata))
      var that = this
      testutil.getrecordInfo(recorddata,(res)=>{
        console.log(res.data)
        that.setData({
          record:res.data
        })
        console.log(that.data.record)
      })
    }
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
  GotoRecord(e){
    console.log(e.currentTarget.dataset.item.testid)
    wx.navigateTo({
      url: '/pages/history/history?id='+e.currentTarget.dataset.item.testid,
    })
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
    // console.log(this.data.record)
  },

})