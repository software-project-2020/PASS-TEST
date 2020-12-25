// pages/zyy_memory_span/rule/rule.js
Page({
  data: {
    numList: [{
      name: '开始记忆'
    }, {
      name: '拖拽成功'
    }, {
      name: '拖拽失败'
    }, {
      name: '提交答案'
    }, ],
    num: 0,
    scroll: 0,
    rules: [{
        words: "请记住这些数字各自的位置。一定时间后，数字会转移到屏幕下方。",
        img: "https://picture.morii.top/renzhixuetang/rules/S11-rule/S11-step1.jpg"
      },
      {
        words: "被拖拽的数字会自动吸附到附近的格子上",
        img: "https://picture.morii.top/renzhixuetang/rules/S11-rule/S11-step2.gif"
      },
      {
        words: "如果附近没有格子，松手后，数字会回到屏幕下方",
        img: "https://picture.morii.top/renzhixuetang/rules/S11-rule/S11-step3.gif"
      },
      {
        words: "完成以后，要记得点击\"提交答案\"的按钮哦",
        img: "https://picture.morii.top/renzhixuetang/rules/S11-rule/S11-step4.jpg"
      }
    ]
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '继时性加工测试'
    })
  },
  goTest: function (e) {
    wx.showModal({
      title: '开始练习',
      content: '在开始测试之前，你有一次练习的机会，快去熟悉一下题目吧!',
      cancelText: '跳过练习',
      confirmText: '练习一下',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          wx.redirectTo({
            url: '/pages/zyy_memory_span/test/test',
          })
        } else {
          wx.redirectTo({
            url: '/pages/zyy_memory_span/memory_span',
          })
        }
      }
    });
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
});