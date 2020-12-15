// pages/attention/attention_game.js
var util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: 0,
    rightcount: 0,
    wrongcount: 0,
    rightflag: false,
    wrongflag: false,
    flag : false,
    answer1: Math.floor(Math.random() * 10),
    answer2: Math.floor(Math.random() * 10),
    answer3: Math.floor(Math.random() * 10),
    grade: 0,
    time: [],
    dialogShow: false,
    oneButton: [{
      text: '确定'
    }],
    NumCount: 0, //当前题数
    letter: ["练习结束，测试正式开始", "本游戏结束，开始下一个游戏"]
  },
  onReady: function () {
    this.setData({
      number_count: [10, 20], // 总题数 //参数
      longestTime: [4, 2], //参数
      shortestTime: [2, 0.5],  //参数
      intervalTime: [0.2, 0.1],  //参数
    })
    this.init()
    this.initnum()
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '注意'
    })
  },
  initnum() {

    var OldNum = this.data.Num;
    var Num = Math.floor(Math.random() * 10);
    while (Num == OldNum) {
      Num = Math.floor(Math.random() * 10);
    }
    this.setData({
      flag : false,
      Num: Num,
    })
    util.initCountDown(this, this.data.time[this.data.NumCount], 0.1)
    console.log(Num)
    console.log("新数字：" + Num)
    console.log("上一个数字：" + OldNum)
    console.log("题数：" + this.data.NumCount)

  },
  init() {
    this.setData({
      rightcount: 0,
      wrongcount: 0,
      rightflag: false,
      wrongflag: false,
      flag : false,
      answer1: Math.floor(Math.random() * 10),
      answer2: Math.floor(Math.random() * 10),
      answer3: Math.floor(Math.random() * 10),
    })
    if (this.data.answer1 == this.data.answer2) {
      this.init();
    } else if (this.data.answer1 == this.data.answer3) {
      this.init();
    } else if (this.data.answer2 == this.data.answer3) {
      this.init();
    }
    console.log(this.data.answer1);
    console.log(this.data.answer2);
    console.log(this.data.answer3);
    var time = this.data.time;
    var longestTime = this.data.longestTime[this.data.number];
    var shortestTime = this.data.shortestTime[this.data.number];
    var intervalTime = this.data.intervalTime[this.data.number];
    for (var i = 0; i < this.data.number_count[this.data.number]; i++) {
      if (longestTime >= shortestTime) {
        time[i] = longestTime;
        longestTime = (longestTime - intervalTime).toFixed(1);
      } else {
        time[i] = shortestTime;
      }
    }
    this.setData({
      time: time,
    })
    console.log(time);
  },
  sum() {
    console.log("错误题数：" + this.data.wrongcount);
    console.log("正确题数：" + this.data.rightcount)
    var right = this.data.rightcount * 1.0 / this.data.number_count[this.data.number];
    var grade = right * 100 / 2.0;
    this.setData({
      grade: grade,
    })
    console.log("成绩：" + grade)
  },

  timeout: function () {
    var Num = this.data.Num;
    console.log("rightflag = " + this.data.rightflag)
    console.log("wrongflag = " + this.data.wrongflag)
    var rightcount = this.data.rightcount;
    var wrongcount = this.data.wrongcount;
    console.log(Number(Num) == Number(this.data.answer1) || Number(Num) == Number(this.data.answer2) || Number(Num) == Number(this.data.answer3))
    if (Number(Num) == Number(this.data.answer1) || Number(Num) == Number(this.data.answer2) || Number(Num) == Number(this.data.answer3)) {
      if (this.data.rightflag) {
        rightcount++;
      } else {
        wrongcount++;
      }
    } else if (Number(Num) != Number(this.data.answer1) && Number(Num) != Number(this.data.answer2) && Number(Num) != Number(this.data.answer3)) {
      if (this.data.wrongflag) {
        rightcount++;
      } else {
        wrongcount++;
      }
    }
    console.log("rightcount = " + rightcount)
    console.log("wrongcount = " + wrongcount)
    var NumCount = this.data.NumCount;
    NumCount++;
    this.setData({
      dialogShow: true,
      NumCount: NumCount,
      rightflag: false,
      wrongflag: false,
      rightcount: rightcount,
      wrongcount: wrongcount
    })
    if (this.data.NumCount < this.data.number_count[this.data.number]) {
      this.initnum();
    } else {
      this.sum();
      this.setData({
        finish: true
      })
    }

  },

  tapDialogButton: function () {
    util.closeCountDown(this)
    console.log("下一题")
    this.setData({
      dialogShow: false,
    })
    var Num = this.data.number;
    Num = Num + 1;
    this.setData({
      number: Num,
      NumCount: 0,
      finish: false
    })
    if (this.data.number == 2) {
      wx.navigateTo({
        url: '../../attention/rule2/attention'
      })
    } else {
      this.init()
      this.initnum()
    }

  },

  right: function (e) {
    if (this.data.flag != true){
      this.setData({
        rightflag: true,
        flag : true
      })
    }
    console.log("rightflag : "+this.data.rightflag)
      
  },
  wrong: function (e) {
    if (this.data.flag != true){
      this.setData({
        wrongflag: true,
        flag : true
      })
    }
    console.log("wrongflag : "+this.data.wrongflag)

  },

})