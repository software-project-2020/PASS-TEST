var util = require('../../../utils/util')
var testutil = require('../../../utils/testutil')
const app = getApp()
Page({
  data: {
    now: 1, //当前题目序号
    total: 6, //总题数
    test: 0,  //测试标记
    score: 0, //得分
    sumscore: 0, //总得分
    sumtest: 0, //测试总题数
    count: 0, //错题数
    answer: "", //当前选择的回答
    timer: '',  //定时器名字
    choosed: [false, false, false, false],
    exeshow: true,
    testtime: 3,
    dialogShow: false,
    qa: [],
  },

  choose: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var flag = this.data.choosed;
    var i;
    for (i = 0; i < 4; i++) {
      if (i != index)
        flag[i] = false;
      else
        flag[i] = true;
    }
    this.setData({
      answer: this.data.qa[this.data.now - 1].option[index],
      choosed: flag
    })
  },

  sure: function () {
    if (this.data.now != 1) {
      if (this.data.answer == this.data.qa[this.data.now - 1].right_answer) {
        this.data.score++;
        this.setData({
          choosed: [false, false, false, false],
          exeshow: true,
          testtime: parseInt(this.data.qa[this.data.now-1].sentence.length / 2)
        })
        util.closeCountDown(this)
        util.initCountDown(this, this.data.testtime, 1)
      } else {
        this.data.count++;
      }
      this.gameover();
    } else {
      var text
      if (this.data.answer == this.data.qa[this.data.now - 1].right_answer)
        text = "恭喜你答对啦，你有充足的时间来完成这项测试，现在就请点击确定按钮开始吧！"
      else
        text = "做错了，不要着急，再仔细一些，可以点击取消重新看一下题目。如果你准备好了，接下来你会有充足的时间来完成这项测试，现在就请点击确定按钮开始吧！"
      util.closeCountDown(this)
      var that = this
      wx.showModal({
        title: '练习结束',
        content: text,
        confirmText: '开始测试',
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            that.setData({
              now: that.data.now + 1,//进入下一个游戏
              choosed: [false, false, false, false],
              exeshow: true,
              testtime: parseInt(that.data.qa[that.data.now-1].sentence.length / 2)
            })
            util.closeCountDown(that)
            util.initCountDown(that, that.data.testtime, 1)
          }
        }
      })
    }
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '继时性加工测试'
    })
    var that = this
    testutil.getS22((res) => {
      console.log(JSON.stringify(res.qa[0]))
      that.setData({
        qa: res.qa
      })
      console.log(this.data.qa)
    })
    util.initCountDown(this, this.data.testtime, 1)
  },

  timeout: function () {
    if (this.data.now != 1) {
      if (this.data.exeshow == true) {
        this.setData({
          exeshow: false
        })
      } else {
        this.setData({
          dialogShow: true
        })
        var that = this
        wx.showModal({
          title: '提交答案',
          content: '请继续完成下一题！',
          confirmText: '确定',
          showCancel: false,
          success: function (res) {
            that.sure()
            that.setData({
              dialogShow: false
            })
          }
        })
      }
      if (this.data.exeshow == true) {
        util.closeCountDown(this)
      } else if (this.data.dialogShow == true) {
        util.closeCountDown(this)
      } else {
        this.setData({
          testtime: parseInt(this.data.qa[this.data.now-1].question.length / 2) + this.data.qa[this.data.now-1].right_answer.length * 2
        })
        util.initCountDown(this, this.data.testtime, 1)
      }
    } else {
      if (this.data.exeshow == true) {
        this.setData({
          exeshow: false
        })
      } else {
        var that = this
        wx.showModal({
          title: '练习结束',
          content: text,
          confirmText: '开始测试',
          success: function (res) {
            if (res.confirm) { //这里是点击了确定以后
              that.setData({
                now: that.data.now + 1,//进入下一个游戏
                choosed: [false, false, false, false],
                exeshow: true,
                testtime: parseInt(that.data.qa[that.data.now].sentence.length / 2)
              })
              util.closeCountDown(that)
              util.initCountDown(that, that.data.testtime, 1)
            }
          }
        })
      }
    }
  },

  sumscore: function () {
    this.setData({
      sumscore: app.globalData.scoreDetail[3][0].score + app.globalData.scoreDetail[3][1].score + app.globalData.scoreDetail[3][2].score,
      sumtest: app.globalData.scoreDetail[3][0].qnum + app.globalData.scoreDetail[3][1].qnum + app.globalData.scoreDetail[3][2].qnum,
    })
  },

  gameover: function () {
    if (this.data.now == 6) {
      util.closeCountDown(this)
      app.globalData.scoreDetail[3][2] = { score: this.data.score, qnum: 5 }
      this.sumscore()
      app.globalData.score[3] = this.data.sumscore / this.data.sumstest * 100
      wx.showModal({
        title: '恭喜',
        content: '恭喜你完成本次测试！点击按钮查看本次测试的最终结果！',
        confirmText: '确定',
        showCancel: false,
        success: function (res) {
          wx.redirectTo({
            url: '../../result/result',
          })
        }
      })
    } else {
      this.setData({
        now: this.data.now + 1,//进入下一个游戏
        choosed: [false, false, false, false],
        exeshow: true,
        testtime: parseInt(this.data.qa[this.data.now].sentence.length / 2)
      })
      util.closeCountDown(this)
      util.initCountDown(this, this.data.testtime, 1)
    }
  }
})