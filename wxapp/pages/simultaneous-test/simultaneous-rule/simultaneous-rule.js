// pages/simultaneous-test/simultaneous-rule/simultaneous-rule.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basics: 0,
    numList: [{
      name: '开始'
    }, {
      name: '选择'
    }, {
      name: '继续'
    }, {
      name: '完成'
    }, ],
    num: 0,
    scroll: 0,
    rules:[{
      words:"进入页面后，你将会看到一个矩阵题目",
      img:"https://picture.morii.top/renzhixuetang/rules/S12-rules/S12-step1.jpg"
    },
    {
      words:"你需要观察出规律，找出正确的填补选项",
      img:"https://picture.morii.top/renzhixuetang/rules/S12-rules/S12-step2.jpg"
    },
    {
      words:"做完一题后点击下一题按钮",
      img:"https://picture.morii.top/renzhixuetang/rules/S12-rules/S12-step3.jpg"
    },
    {
      words:"完成所有的题目后请点击提交按钮。如果已经对规则了解了的话，就点击开始测试的按钮吧",
      img:"https://picture.morii.top/renzhixuetang/rules/S12-rules/S12-step4.jpg"
    }]
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
            url: '/pages/simultaneous-test/simultaneous1/simultaneous1',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '同时性加工测试'
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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