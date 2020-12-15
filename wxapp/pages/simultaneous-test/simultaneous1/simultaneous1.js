// pages/simultaneous-test/simultaneous1/simultaneous1.js
var util = require('../../../utils/util.js')
var testutil = require('../../../utils/testutil.js')
const app = getApp()
Page({
  data: {
    score: 0,
    choosed: [false, false, false, false, false, false, false, false],
    now: 0,
    answer: [],
    qnum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    testutil.getS12(1, (res) => {
      console.log(res)
      this.setData({
        qnum: res.qnum,
        qlist: res.qlist
      })
      // console.log(res.qlist)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  chooseAnster: function (e) {
    console.log(e.currentTarget.dataset.index)
    var i = e.currentTarget.dataset.index,
      j
    var flag = this.data.choosed
    var nowq = this.data.now
    var allc = this.data.qlist[nowq].option
    if (i < allc.length) {
      for (j = 0; j < allc.length; j++) {
        if (j != i) flag[j] = false;
        else flag[j] = true;
      }
      var answer = this.data.answer
      answer[nowq] = parseInt(i) + 1
      this.setData({
        choosed: flag,
        answer: answer
      })
    }

  },
  submitAnswer: function () {
    util.closeCountDown(this)
    var that=this
    wx.showModal({
      title: '提交结果',
      content: '恭喜你完成了所有题目，点击提交结果进入下一项测试吧！如果想要再检查一下也可以点击继续测试哦！',
      cancelText: '继续测试',
      confirmText: '提交结果',
      success: function (res) {
        if (res.confirm) { //提交
          var score=0
          for(var i=0;i<that.data.qnum;i++){
            if(that.data.answer[i]==that.data.qlist[i].answer)
              score++
          }
          //S12占测试总数的0.6
          app.globalData.score_detail[1][0]={score:score,qnum:that.data.qnum-1}
          app.globalData.score[1]=score/(that.data.qnum-1)*100*0.6
          console.log(app.globalData.score_detail[1],app.globalData.score[1])
          wx.navigateTo({
            url: '/pages/simultaneous-test/simultaneous-rule2/simultaneous-rule2',
          })
        } else if (res.cancel) {//继续
          util.initCountDown(that, that.data.displayTime, 1)
        }
      }
    })
  },
  timeout: function () {
    submitAnswer()
  },
  tapDialogButton: function () {
    this.setData({
      dialogShow: false,
    })
  },
  preQuestion: function () {
    this.setData({
      now: this.data.now - 1
    })
  },
  nextQuestion: function () {
    if(this.data.now >0){
      if(this.data.answer[this.data.now]==null){
        wx.showModal({
          title: '未完成',
          content: '当前题目未完成，请点击确定按钮继续完成这一题',
          confirmText: '确定',
          showCancel: false,
          success: function (res) {
          }
        })
      }else{
        this.setData({
          now: this.data.now + 1
        })
      }
    }else{
      this.setData({
        now: this.data.now + 1
      })
    }
  },
  start: function () {
    var text
    if (this.data.qlist[0].answer == this.data.answer[0])
      text = "恭喜你答对啦，你有充足的时间来完成这项测试，现在就请点击确定按钮开始吧！"
    else
      text = "做错了，不要着急，再仔细一些，可以点击取消重新看一下题目。如果你准备好了，接下来你会有充足的时间来完成这项测试，现在就请点击确定按钮开始吧！"
    var that = this
    wx.showModal({
      title: '练习结束',
      content: text,
      cancelText: '再次尝试',
      confirmText: '开始测试',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          that.nextQuestion();
          util.initCountDown(that, 300, 1)
        }
      }
    })
  }
})