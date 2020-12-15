var util = require('../../../utils/util')
const app = getApp()
Page({
  data: {
    qa: [
      {
        sentence: "白色是蓝色的。",
        question: "谁是蓝色的？",
        option: ["蓝色", "白色", "蓝白色", "白蓝色"],
        right_answer: "白色"
      }, {
        sentence: "这些红色是黑色的。",
        question: "什么是黑色的？",
        option: ["黑色", "红色", "红黑色", "黑红色"],
        right_answer: "红色"
      }, {
        sentence: "黄色把蓝色变成绿色了。",
        question: "谁把蓝色变成绿色？",
        option: ["蓝色", "绿色", "黄色", "灰色"],
        right_answer: "黄色"
      }, {
        sentence: "粉色正黄色着茶色。",
        question: "粉色正在做什么？",
        option: ["黄色着", "茶色着", "黄色", "茶色"],
        right_answer: "黄色着"
      }, {
        sentence: "红色用黄色把绿色变成了蓝色。",
        question: "谁用黄色？",
        option: ["蓝色", "绿色", "黄色", "红色"],
        right_answer: "红色"
      }, {
        sentence: "黄色和绿色把紫色变成了棕色。",
        question: "谁把紫色变成棕色了？",
        option: ["蓝色和绿色", "绿色和棕色", "黄色和绿色", "绿色和紫色"],
        right_answer: "黄色和绿色"
      }, {
        sentence: "茶色绿色成黑色，紫色褐色成白色。",
        question: "紫色褐色成什么？",
        option: ["茶色", "绿色", "白色", "黑色"],
        right_answer: "白色"
      }, {
        sentence: "黄色已经把蓝色的棕色变成粉色了。",
        question: "黄色把什么变成粉色了？",
        option: ["蓝色的棕色", "黄色的蓝色", "黄色的棕色", "蓝色的粉色"],
        right_answer: "蓝色的棕色"
      }, {
        sentence: "蓝色把褐色白色成红色。",
        question: "蓝色在做什么？",
        option: ["把白色褐色成红色", "把白色红色成褐色", "把褐色白色成红色", "把褐色红色成白色"],
        right_answer: "把褐色白色成红色"
      }, {
        sentence: "当褐色在粉色中黄色的时候，紫色在绿色中蓝色着。",
        question: "紫色在哪里蓝色着？",
        option: ["绿色（中）", "粉色（中）", "黄色（中）", "褐色（中）"],
        right_answer: "绿色（中）"
      }, {
        sentence: "这些紫色的黄色是绿色的，而这些红色是白色的。",
        question: "谁是绿色的？",
        option: ["红色", "紫色的黄色", "黄色的紫色", "白色"],
        right_answer: "紫色的黄色"
      }, {
        sentence: "把黄色变成蓝色的红色，在绿色上变成棕色了。",
        question: "红色在哪里变成棕色？",
        option: ["黄色上", "蓝色上", "红色上", "绿色上"],
        right_answer: "绿色上"
      }, {
        sentence: "为了把绿色的紫色，而不是把棕色的紫色变成粉色，红色正蓝色着。",
        question: "红色正蓝色着是为了把哪个紫色变成粉色？",
        option: ["红色的", "蓝色的", "绿色的", "棕色的"],
        right_answer: "绿色的"
      }, {
        sentence: "绿色把蓝色变成红色，把棕色变成黄色了。",
        question: "绿色在做什么？",
        option: ["把蓝色变成棕色，把红色变成黄色了", "把蓝色变成红色，把棕色变成黄色了", "把红色变成蓝色，把棕色变成黄色了", "把蓝色变成红色，把黄色变成棕色了"],
        right_answer: "把蓝色变成红色，把棕色变成黄色了"
      }, {
        sentence: "把蓝色的白色变成褐色的那个棕色，为了把红色变成黑色，把绿色变成了粉色。",
        question: "为什么棕色把绿色变成了粉色？",
        option: ["为了把红色变成黑色", "为了把蓝色的白色变成褐色", "为了把黑色变成红色", "为了把白色的蓝色变成褐色"],
        right_answer: "为了把红色变成黑色"
      }, {
        sentence: "把蓝色茶色成黑色的那个红色，在粉色把褐色变成黄色之前绿色了。",
        question: "什么被茶色了？",
        option: ["蓝色", "黑色", "红色", "褐色"],
        right_answer: "蓝色"
      }, {
        sentence: "棕色把绿色变成蓝色，但正在紫色的白色中红色着的那个粉色被绿色蓝色着。",
        question: "绿色蓝色着谁？",
        option: ["红色", "白色", "紫色", "粉色"],
        right_answer: "粉色"
      }, {
        sentence: "把黄色的粉色变成绿色的那个白色，黑色了把红色变成棕色的茶色。",
        question: "白色把什么黑色了？",
        option: ["绿色", "粉色", "茶色", "黄色"],
        right_answer: "茶色"
      }, {
        sentence: "当茶色把黄色绿色成棕色的时候，紫色用粉色把褐色变成黑色了。",
        question: "什么时候紫色把褐色变成黑色了？",
        option: ["茶色把绿色黄色成棕色时", "茶色把棕色绿色成黄色时", "茶色把黄色棕色成绿色时", "茶色把黄色绿色成棕色时"],
        right_answer: "茶色把黄色绿色成棕色时"
      }, {
        sentence: "蓝色把粉色中的一个绿色的黄色变成红色，那些粉色在棕色中是紫色的，然后蓝色又褐色着茶色。",
        question: "蓝色首先做了什么？",
        option: ["把棕色中的一个绿色的黄色变成红色", "把粉色中的一个绿色的黄色变成红色", "把粉色中的一个棕色的褐色变成红色", "把粉色中的一个蓝色的茶色变成红色"],
        right_answer: "把粉色中的一个绿色的黄色变成红色"
      },
    ],
    now: 1, //当前题目序号
    total: 27, //总题数
    test: 0,  //测试标记
    score: 0, //得分
    count: 0, //错题数
    answer: "", //当前选择的回答
    dialogShow: false,
    oneButton: [{ text: '确定' }],
    timer: '',  //定时器名字
    choosed: [false, false, false, false],
    text: "请继续完成下一题",
    exeshow: true,
    testtime: 3,
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
          now: this.data.now + 1,//进入下一个游戏
          choosed: [false, false, false, false],
          exeshow: true,
          testtime: parseInt(this.data.qa[this.data.now].sentence.length / 2)
        })
        util.closeCountDown(this)
        util.initCountDown(this, this.data.testtime, 1)
      } else {
        this.data.count++;
        this.gameover();
      }
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
              testtime: parseInt(that.data.qa[that.data.now].sentence.length / 2)
            })
            util.closeCountDown(that)
            util.initCountDown(that, that.data.testtime, 1)
          }
        }
      })
    }
  },

  resultShow: function () {
    wx.navigateTo({
      url: '../../S2/successive/successive',
    })
  },

  onLoad: function (options) {
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
      }
      if (this.data.exeshow == true) {
        util.closeCountDown(this)
      } else if (this.data.dialogShow == true) {
        util.closeCountDown(this)
      } else {
        this.setData({
          testtime: parseInt(this.data.qa[this.data.now].question.length / 2) + this.data.qa[this.data.now].right_answer.length * 2
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

  tapDialogButton: function () {
    this.sure()
    this.setData({
      dialogShow: false
    })
  },

  gameover: function () {
    if (this.data.count == 3 || this.data.now == 27) {
      util.closeCountDown(this)
      app.globalData.score[3] = { score: this.data.score, qnum: this.data.now }
      wx.showModal({
        title: '恭喜',
        content: '恭喜你完成本次测试！点击按钮查看本次测试的最终结果！',
        confirmText: '确定',
        showCancel: false,
        success: function (res) {
          wx.redirectTo({
            url: '../../S2/successive-rules/successive-rules',
          })
        }
      })
      console.log("得分：",this.data.score)
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