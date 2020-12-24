// pages/planning-test/rule4.1/rule4.1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ageGroup:null,
    basics: 0,
    numList: [{
      name: '开始'
    }, {
      name: '点击'
    }, {
      name: '加分'
    }, {
      name: '完成'
    }, ],
    num: 0,
    scroll: 0,
    rules:[{
      words:"进入页面后，将会有若干个单词或者单词或者单词和图片出现",
      img:"https://picture.morii.top/renzhixuetang/lyq/rule4.1.gif"
    },
    {
      words:"你需要在单词切换的同时，记住这些单词的顺序",
      img:"https://picture.morii.top/renzhixuetang/lyq/rule4.1.gif"
    },
    {
      words:"单词显示完毕后，按照记忆依次点击单词，再次点击可以取消选择，重新排序",
      img:"https://picture.morii.top/renzhixuetang/lyq/rule4.1.gif"
    },
    {
      words:"完成之后会自动结束哦。如果已经对规则了解了的话，就点击开始测试的按钮吧",
      img:"https://picture.morii.top/renzhixuetang/lyq/rule4.1.gif"
    }]
  },
  gototest1:function(e){
    wx.showModal({
      title: '开始练习',
      content: '在开始测试之前，你有一次练习的机会，练习将不会被计入成绩，快去熟悉一下题目吧!',
      cancelText:'取消',
      confirmText:'开始练习',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.redirectTo({
            url: '/pages/planning-test/test4.1/test4.1',
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
      title: '继时性加工测试'
    })
    this.setData({
      // ageGroup:1
      ageGroup:getApp().globalData.userInfo.ageGroup
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