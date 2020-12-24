// pages/attention/attention.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basics: 0,
    numList: [{
      name: '读题'
    }, {
      name: '开始'
    }, {
      name: '匹配'
    } , {
      name: '完成'
    }],
    num: 0,
    scroll: 0,
    rules:[{
      words:"进入页面后，你将会看到一个题目，点击按钮开始做题",
      img:"https://picture.morii.top/renzhixuetang/attention/A2-step1.png"
    },
    {
      words:"做题开始，会出现一些字母或者数字",
      img:"https://picture.morii.top/renzhixuetang/attention/A2-step2.gif"
    },
    {
      words:"如果下面的字母或者数字与题目匹配，则点击该字母或者数字",
      img:"https://picture.morii.top/renzhixuetang/attention/A2-step3.png"
    },
    {
      words:"在一定时间内，找出你认为的所有答案后，可以点击完成按钮进入下一题",
      img:"https://picture.morii.top/renzhixuetang/attention/A2-step4.gif"
    }]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '注意测试'
    })
  },
  gototest1: function (e) {

    wx.showModal({
      title: '开始练习',
      content: '在开始测试之前，你有一次练习的机会，练习将不会被计入成绩，快去熟悉一下题目吧!',
      cancelText:'取消',
      confirmText:'开始练习',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.redirectTo({
            url: '/pages/attention/game2/attention_game',
          })
        }
      }
    })
  },

  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },
  numStepsBack() {
    this.setData({
      num: this.data.num - 1
    })
  }
})