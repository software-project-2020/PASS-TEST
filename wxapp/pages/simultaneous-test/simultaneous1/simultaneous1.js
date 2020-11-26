// pages/simultaneous-test/simultaneous1/simultaneous1.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '',//定时器名字
    countDownNum: '60',//倒计时初始值
    dialogShow: false,
    oneButton: [{ text: '确定' }],
    score:0,
    wrong:0,
    isPass:false,
    isFaild:false,
    text:"请继续完成下一题",
    qlist: [{
        'q': 'https://picture.morii.top/renzhixuetang/tiku1/q1.png',
        'c': ["https://picture.morii.top/renzhixuetang/tiku1/c1.png", "https://picture.morii.top/renzhixuetang/tiku1/c2.png", "https://picture.morii.top/renzhixuetang/tiku1/c3-r1.png", "https://picture.morii.top/renzhixuetang/tiku1/c4.png", "https://picture.morii.top/renzhixuetang/tiku1/c5.png", "https://picture.morii.top/renzhixuetang/tiku1/c6.png"],
        'rightanswer': 2
      },
      {
        'q': 'https://picture.morii.top/renzhixuetang/tiku1/q2.png',
        'c': ["https://picture.morii.top/renzhixuetang/tiku1/c2.png", "https://picture.morii.top/renzhixuetang/tiku1/c2.png", "https://picture.morii.top/renzhixuetang/tiku1/c3-r1.png", "https://picture.morii.top/renzhixuetang/tiku1/c4.png", "https://picture.morii.top/renzhixuetang/tiku1/c5.png", "https://picture.morii.top/renzhixuetang/tiku1/c6.png"],
        'rightanswer': 2
      },
      {
        'q': 'https://picture.morii.top/renzhixuetang/tiku1/q3.png',
        'c': ["https://picture.morii.top/renzhixuetang/tiku1/c1.png", "https://picture.morii.top/renzhixuetang/tiku1/c2.png", "https://picture.morii.top/renzhixuetang/tiku1/c3-r1.png", "https://picture.morii.top/renzhixuetang/tiku1/c4.png", "https://picture.morii.top/renzhixuetang/tiku1/c5.png", "https://picture.morii.top/renzhixuetang/tiku1/c6.png"],
        'rightanswer': 2
      },
      {
        'q': 'https://picture.morii.top/renzhixuetang/tiku1/q4.png',
        'c': ["https://picture.morii.top/renzhixuetang/tiku1/c1.png", "https://picture.morii.top/renzhixuetang/tiku1/c2.png", "https://picture.morii.top/renzhixuetang/tiku1/c3-r1.png", "https://picture.morii.top/renzhixuetang/tiku1/c4.png", "https://picture.morii.top/renzhixuetang/tiku1/c5.png", "https://picture.morii.top/renzhixuetang/tiku1/c6.png"],
        'rightanswer': 2
      },
      {
        'q': 'https://picture.morii.top/renzhixuetang/tiku1/q5.png',
        'c': ["https://picture.morii.top/renzhixuetang/tiku1/c1.png", "https://picture.morii.top/renzhixuetang/tiku1/c2.png", "https://picture.morii.top/renzhixuetang/tiku1/c3-r1.png", "https://picture.morii.top/renzhixuetang/tiku1/c4.png", "https://picture.morii.top/renzhixuetang/tiku1/c5.png", "https://picture.morii.top/renzhixuetang/tiku1/c6.png"],
        'rightanswer': 2
      },
    ],
    choosed:[false,false,false,false,false,false],
    answer:0,
    now : 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    util.initCountDown(this,5,1)
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  chooseAnster:function(e){
    console.log(e.currentTarget.dataset.index)
    var i =e.currentTarget.dataset.index,j;
    var flag = this.data.choosed;
    
    for(j=0;j<6;j++){
      if(j!=i) flag[j]=false;
      else flag[j]=true;
    }
    console.log(i,flag)
    this.setData({
      choosed: flag,
      answer:i
    })
  },
  submitAnswer:function(){
    // var now=this.data.now
    // if(this.data.qlist[now].rightanswer==this.data.answer){
    //   var score =this.data.score+1
    //   this.setData({
    //     score :score
    //   })
    // }else{
    //   var wrong =this.data.wrong+1
    //   this.setData({
    //     wrong :wrong
    //   })
    // }
    // now=now+1
    // this.setData({
    //   now :now
    // })
    util.closeCountDown(this)
  },
  timeout: function () {
    this.setData({
      dialogShow: true
    })
  },
  tapDialogButton:function(){
    console.log("下一题")
    this.setData({
      dialogShow: false
    })
    util.initCountDown(this,5,1)
  }
})