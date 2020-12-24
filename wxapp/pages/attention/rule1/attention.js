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
    }, {
      name: '不匹配'
    }, ],
    num: 0,
    scroll: 0,
    rules:[{
      words:"进入页面后，你将会看到一个题目，记住题目给出的三个数字，点击按钮开始做题",
      img:"https://picture.morii.top/renzhixuetang/rules/attention/A1-step1.png"
    },
    {
      words:"做题开始，会出现快速跳动的数字",
      img:"https://picture.morii.top/renzhixuetang/rules/attention/A1-step2.gif"
    },
    {
      words:"如果出现的数字为题目给出的数字中的一个，则在跳出下一个数字之前点击✔按钮",
      img:"https://picture.morii.top/renzhixuetang/rules/attention/A1-step3.png"
    },
    {
      words:"如果出现的数字不为题目给出的数字中的任何一个，则在跳出下一个数字之前点击❌按钮",
      img:"https://picture.morii.top/renzhixuetang/rules/attention/A1-step4.png"
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
            url: '/pages/attention/game1/attention_game',
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