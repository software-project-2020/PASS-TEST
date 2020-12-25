// pages/zyy_memory_span/rule/rule.js
Page({
  data: {
    numList: [{
      name: '开始'
    }, {
      name: '画图'
    }, {
      name: '错误'
    }, {
      name: '完成'
    }, ],
    num: 0,
    scroll: 0,
    rules: [{
        words: "进入页面后，你将会看到一句描述性的文字",
        img: "https://picture.morii.top/renzhixuetang/rules/S11-rule/S11-step1.jpg"
      },
      {
        words: "你需要将题目中描述的形状在屏幕上画出来",
        img: "https://picture.morii.top/renzhixuetang/rules/S11-rule/S11-step2.gif"
      },
      {
        words: "请注意，为避免误判，请尽量将图形画的标准一些哦",
        img: "https://picture.morii.top/renzhixuetang/rules/S11-rule/S11-step3.gif"
      },
      {
        words: "做完后请点击下面的按钮提交成绩。如果已经对规则了解了的话，就点击开始测试的按钮吧",
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