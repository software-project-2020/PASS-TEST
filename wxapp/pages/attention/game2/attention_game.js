// pages/attention/attention_game.js
var util = require('../../../utils/util')
var testutil = require('../../../utils/testutil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: 0,
    question_text: ["选出下列图片中的 ", "选出下列字母中的 "],
    list_big_letter: {
      0: "A",
      1: "B",
      2: "C",
      3: "D",
      4: "E",
      5: "F",
      6: "G",
      7: "H",
      8: "I",
      9: "J",
      10: "K",
      11: "L",
      12: "M",
      13: "N",
      14: "O",
      15: "P",
      16: "Q",
      17: "R",
      18: "S",
      19: "T",
      20: "U",
      21: "V",
      22: "W",
      23: "X",
      24: "Y",
      25: "Z",
    },
    list_small_letter: {
      0: "a",
      1: "b",
      2: "c",
      3: "d",
      4: "e",
      5: "f",
      6: "g",
      7: "h",
      8: "i",
      9: "j",
      10: "k",
      11: "l",
      12: "m",
      13: "n",
      14: "o",
      15: "p",
      16: "q",
      17: "r",
      18: "s",
      19: "t",
      20: "u",
      21: "v",
      22: "w",
      23: "x",
      24: "y",
      25: "z",
    },
    age1_question: Math.floor(Math.random() * 26),
    age2_question: Math.floor(Math.random() * 26),
    oneButton: [{
      text: '确定'
    }],
    write: ["练习结束，测试正式开始", "请继续完成下一题", "本游戏结束，开始下一个测试"],
    text: ["练习", "进度：1/2", "进度：2/2"],
    start: false,
    button: ['开始练习', '开始测试', '开始测试']
  },
  onReady: function () {},
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '注意测试'
    })
  },
  onLoad: function () {
    //年龄暂时为写死为1
    var age = getApp().globalData.userInfo.ageGroup
    // var age = 1
    testutil.getconfiguration(age, 'A2', (res) => {
      console.log(res)
      var line = []
      var column = []
      var time = []
      for (var i = 0; i < res.length; i++) {
        var temp = JSON.parse(res[i].parameter_info)
        console.log(temp)
        line[i] = temp.line
        column[i] = temp.column
        time[i] = temp.time
      }
      this.setData({
        line: line,
        column: column,
        time: time,
        age: age
      })
      this.init()
    })

    var that = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res);
        console.log(res.windowWidth);
        console.log(res.windowHeight);
        that.setData({
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight,
        })
      }
    })

  },
  //初始化表格
  initnum() {
    if (this.data.start == true) {
      this.setData({
        l: [],
        num: [],
        bg: [],
        flag: [],
      })
      var bg = this.data.bg;
      var num = this.data.num;
      var flag = this.data.flag;
      for (var i = 0; i < this.data.line[this.data.number] * this.data.column[this.data.number]; i++) {
        bg.push(true);
        num.push("0");
        flag.push(0);
      }
      this.setData({
        bg: bg,
        num: num,
        flag: flag
      })
      var i = 0;
      var j = 0;
      var k = 0;
      var a, a2;
      var l = this.data.l;
      //保证至少有一个答案
      var place = [];
      var size = Math.floor((Math.random() * 10) + 10);
      for (i = 0; i < size; i++) {
        place[i] = Math.floor(((Math.random() * (this.data.line[this.data.number] * this.data.column[this.data.number]))));
      }
      console.log("size : " + size)
      console.log("place : " + place)
      for (i = 0; i < this.data.line[this.data.number]; i++) {
        l.push([])
        for (j = 0; j < this.data.column[this.data.number]; j++) {
          var flag = false;
          for (k = 0; k < size; k++) {
            if (Number((i * this.data.column[this.data.number] + j)) == Number(place[k])) {
              if (this.data.age == 0) {
                if (this.data.number == 0) {
                  if (l[i][j] == null) {
                    var item = {
                      "index": i * this.data.column[this.data.number] + j,
                      "value": this.data.age1_question,
                      "add": this.data.list_big_letter[this.data.age1_question],
                      "number": ""
                    }
                    flag = true;
                  }

                } else if (this.data.number == 1) {
                  if (l[i][j] == null) {
                    var item = {
                      "index": i * this.data.column[this.data.number] + j,
                      "value": this.data.age1_question,
                      "add": this.data.list_small_letter[this.data.age1_question],
                      "number": this.data.age1_question_number
                    }
                    flag = true;
                  }

                } else if (this.data.number == 2) {
                  if (l[i][j] == null) {
                    var item = {
                      "index": i * this.data.column[this.data.number] + j,
                      "value": this.data.age1_question,
                      "add": this.data.list_big_letter[this.data.age1_question],
                      "value2": this.data.age2_question,
                      "number": this.data.list_small_letter[this.data.age2_question],
                    }
                    flag = true;
                  }
                }
              } else if (this.data.age == 1) {
                if (this.data.number == 0) {
                  if (l[i][j] == null) {
                    var item = {
                      "index": i * this.data.column[this.data.number] + j,
                      "value": this.data.age1_question,
                      "add": this.data.list_big_letter[this.data.age1_question],
                      "number": "",
                      "number1": "",
                    }
                    flag = true;
                  }

                } else if (this.data.number == 1) {
                  if (l[i][j] == null) {
                    var item = {
                      "index": i * this.data.column[this.data.number] + j,
                      "value": this.data.age1_question,
                      "add": this.data.list_big_letter[this.data.age1_question],
                      "value2": this.data.age2_question,
                      "number": this.data.list_small_letter[this.data.age2_question],
                      "number1": "",
                    }
                    flag = true;
                  }

                } else if (this.data.number == 2) {
                  if (l[i][j] == null) {
                    var item = {
                      "index": i * this.data.column[this.data.number] + j,
                      "value": this.data.age1_question,
                      "add": this.data.list_big_letter[this.data.age1_question],
                      "value2": this.data.age2_question,
                      "number": this.data.list_small_letter[this.data.age2_question],
                      "number1": this.data.age2_question_number,
                    }
                    flag = true;
                  }
                }
              }
            }
          }
          if (flag == false) {
            if (this.data.age == 0) {
              a = Math.floor(Math.random() * 26);
              a2 = Math.floor(Math.random() * 26);
              if (this.data.number == 0) {
                var item = {
                  "index": i * this.data.column[this.data.number] + j,
                  "value": a,
                  "add": this.data.list_big_letter[a],
                  "value2": "",
                  "number": ""
                }
              } else if (this.data.number == 1) {
                var item = {
                  "index": i * this.data.column[this.data.number] + j,
                  "value": a,
                  "add": this.data.list_small_letter[a],
                  "value2": "",
                  "number": Math.floor(Math.random() * 10)
                }
              } else if (this.data.number == 2) {
                var item = {
                  "index": i * this.data.column[this.data.number] + j,
                  "value": a,
                  "add": this.data.list_big_letter[a],
                  "value2": a2,
                  "number": this.data.list_small_letter[a2],
                }
              }
            } else if (this.data.age == 1) {
              a = Math.floor(Math.random() * 26);
              a2 = Math.floor(Math.random() * 26);
              if (this.data.number == 0) {
                var item = {
                  "index": i * this.data.column[this.data.number] + j,
                  "value": a,
                  "add": this.data.list_big_letter[a],
                  "value2": "",
                  "number": "",
                  "number1": "",
                }
              } else if (this.data.number == 1) {
                var item = {
                  "index": i * this.data.column[this.data.number] + j,
                  "value": a,
                  "add": this.data.list_big_letter[a],
                  "value2": a2,
                  "number": this.data.list_small_letter[a2],
                  "number1": "",
                }
              } else if (this.data.number == 2) {
                var item = {
                  "index": i * this.data.column[this.data.number] + j,
                  "value": a,
                  "add": this.data.list_big_letter[a],
                  "value2": a2,
                  "number": this.data.list_small_letter[a2],
                  "number1": Math.floor(Math.random() * 10)
                }
              }
            }

          }
          l[i].push(item)
        }

      }
      this.setData({
        l: l
      })
      this.choicenum()
      util.initCountDown(this, this.data.time[this.data.number], 1)
    }

  },
  //初始化题目
  init() {
    this.setData({
      answer1: Math.floor(Math.random() * 3),
      rightcount: 0,
      sumcount: 0,
      count: 0,
      grade: 0,
      dialogShow: false,
      age1_question: Math.floor(Math.random() * 26),
      age2_question: Math.floor(Math.random() * 26),
      age1_question_number: Math.floor(Math.random() * 10),
      age2_question_number: Math.floor(Math.random() * 10),
      finishClick: false,
      start: false
    })
    if (this.data.age == 0) {
      if (this.data.number == 0) {
        this.setData({
          word: this.data.list_big_letter[this.data.age1_question]
        })
      } else if (this.data.number == 1) {
        this.setData({
          word: this.data.list_small_letter[this.data.age1_question] + " 和 " + this.data.age1_question_number + " 的组合"
        })
      } else if (this.data.number == 2) {
        this.setData({
          word: this.data.list_big_letter[this.data.age1_question] + " 和 " + this.data.list_small_letter[this.data.age2_question] + " 的组合"
        })
      }
    } else if (this.data.age == 1) {
      if (this.data.number == 0) {
        this.setData({
          word: this.data.list_big_letter[this.data.age1_question]
        })
      } else if (this.data.number == 1) {
        this.setData({
          word: this.data.list_big_letter[this.data.age1_question] + " 和 " + this.data.list_small_letter[this.data.age2_question] + " 的组合"
        })
      } else if (this.data.number == 2) {
        this.setData({
          word: this.data.list_big_letter[this.data.age1_question] + " , " + this.data.list_small_letter[this.data.age2_question] + "和" + this.data.age2_question_number + " 的组合"
        })
      }
    }
    var that = this
    if (this.data.number == 0){
      wx.showModal({
        title: '注意',
        content: '此次为尝试机会，不计入测试成绩',
        confirmText: '开始尝试',
        cancelText: '跳过尝试',
        success: function (res) {
          if(res.confirm){
            that.setData({
            number : 0
          })
          }
          else if(res.cancel){
            that.setData({
              number : 1
            })
            that.init()
          }
        }
      })
    }
  },
  //计算成绩
  sum() {
    var that = this;
    let l = this.data.l;
    var i = 0;
    var j = 0;
    for (i = 0; i < this.data.line[this.data.number]; i++) {
      for (j = 0; j < this.data.column[this.data.number]; j++) {
        let index = "num[" + (i * this.data.column[this.data.number] + j) + "]";
        let count = "ans_num[" + (i * this.data.column[this.data.number] + j) + "]";
        let count1 = "ans_num1[" + (i * this.data.column[this.data.number] + j) + "]";
        let value = l[i][j].value;
        let value2 = l[i][j].value2;
        let number1 = l[i][j].number1;
        if (this.data.age == 0) {
          if (this.data.number == 2) {
            var value_num = l[i][j].value2;
          } else {
            var value_num = l[i][j].number;
          }
        }
        if (this.data.age == 0) {
          that.setData({
            [index]: value,
            [count]: value_num,
          });
        } else if (this.data.age == 1) {
          that.setData({
            [index]: value,
            [count]: value2,
            [count1]: number1,
          });
        }
      }
    }
    var rightcount = that.data.rightcount;
    var sumcount = that.data.sumcount;
    for (i = 0; i < this.data.line[this.data.number] * this.data.column[this.data.number]; i++) {
      if (Number(this.data.flag[i]) == 1) {
        if (this.data.age == 0) {
          if (this.data.number == 0) {
            if (Number(this.data.num[i]) == Number(this.data.age1_question)) {
              rightcount++;
            }
          } else if (this.data.number == 1) {
            if ((Number(this.data.num[i]) == Number(this.data.age1_question)) && (Number(this.data.ans_num[i]) == Number(this.data.age1_question_number))) {
              rightcount++;
            }
          } else if (this.data.number == 2) {
            if ((Number(this.data.num[i]) == Number(this.data.age1_question)) && (Number(this.data.ans_num[i]) == Number(this.data.age2_question))) {
              rightcount++;
            }
          }
        } else if (this.data.age == 1) {
          if (this.data.number == 0) {
            if (Number(this.data.num[i]) == Number(this.data.age1_question)) {
              rightcount++;
            }
          } else if (this.data.number == 1) {
            if ((Number(this.data.num[i]) == Number(this.data.age1_question)) && (Number(this.data.ans_num[i]) == Number(this.data.age2_question))) {
              rightcount++;
            }
          } else if (this.data.number == 2) {
            if ((Number(this.data.num[i]) == Number(this.data.age1_question)) && (Number(this.data.ans_num[i]) == Number(this.data.age2_question)) && (Number(this.data.ans_num1[i]) == Number(this.data.age2_question_number))) {
              rightcount++;
            }
          }
        }
        sumcount++;
      }
    }
    this.setData({
      rightcount: rightcount,
      sumcount: sumcount
    })
    //两个正确率取小值（点击到正确答案的数量  / 总点击数 ， 点击到正确答案的数量 / 总正确答案的数量）
    var right = (this.data.rightcount * 1.0 / this.data.sumcount) * 100 / 4.0;
    var count = (this.data.rightcount * 1.0 / this.data.count) * 100 / 4.0;
    console.log("right : " + right);
    console.log("count : " + count);
    var answer = 0;
    if (Number(right) <= Number(count)) {
      answer = right;
    } else {
      answer = count;
    }
    // console.log(count);
    this.data.grade = answer;
    console.log("grade : " + this.data.grade);
    if (this.data.number == 1) {
      var rightcount = this.data.rightcount;
      var sumcount = this.data.count;
      this.setData({
        sumRight: rightcount,
        sumCount: sumcount,
        sumGrade: answer
      })
      console.log("sumGrade : " + this.data.sumGrade)
    }
    if (this.data.number == 2) {
      var sumGrade = this.data.sumGrade + answer;
      var sumRight = this.data.sumRight + this.data.rightcount;
      var sumCount = this.data.sumCount + this.data.count;
      var sum = getApp().globalData.score[2] + this.data.sumGrade;

      var item = {
        "sumRight": sumRight,
        "sumCount": sumCount
      }

      getApp().globalData.score[2] = Math.round(sum);
      getApp().globalData.scoreDetail[2][1] = item;
      console.log(getApp().globalData.score[2])
      console.log(getApp().globalData.scoreDetail[2][1])
      console.log(getApp().globalData.scoreDetail[2])
    }
  },

  timeout: function () {
    this.sum();
    util.closeCountDown(this)
    console.log("下一题")
    var that = this;
    if (this.data.number == 0) {
      wx.showModal({
        title: '练习结束',
        content: '测试要开始啦，请集中注意力进行测试',
        confirmText: '开始测试',
        cancelText: '再次尝试',
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            console.log('用户点击确定')
            var Num = that.data.number;
            Num = Num + 1;
            that.setData({
              number: Num,
            })
            that.init()
            that.initnum()
          } else if (res.cancel) {
            that.init()
          }
        }
      })
    } else {
      var title;
      var content;
      if (this.data.number == 1) {
        title = '完成';
        content = '稍微休息一下，还有一题，继续集中注意力完成下一题'
      } else if (this.data.number == 2) {
        title = '完成';
        content = '稍微休息一下，进入下一个题目'
      }
      var Num = this.data.number;
      Num = Num + 1;
      this.setData({
        number: Num,
      })
      wx.showModal({
        title: title,
        content: content,
        confirmText: '下一题',
        showCancel: false,
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            console.log('用户点击确定')
            if (that.data.number == 3) {
              wx.redirectTo({
                url: '../../planning-test/rule4.1/rule4.1'
              })
            } else {
              that.init()
              that.initnum()
            }
          }
        }
      })
    }
  },

  //判断一共有几个是正确的
  choicenum: function (e) {
    var that = this;
    let l = this.data.l;
    var i = 0;
    var j = 0;
    for (i = 0; i < this.data.line[this.data.number]; i++) {
      for (j = 0; j < this.data.column[this.data.number]; j++) {
        let index = "num[" + (i * this.data.column[this.data.number] + j) + "]";
        let count = "ans_num[" + (i * this.data.column[this.data.number] + j) + "]";
        let count1 = "ans_num1[" + (i * this.data.column[this.data.number] + j) + "]";
        let value = l[i][j].value;
        let value2 = l[i][j].value2;
        let number1 = l[i][j].number1;
        if (this.data.age == 0) {
          if (this.data.number == 2) {
            var value_num = l[i][j].value2;
          } else {
            var value_num = l[i][j].number;
          }
        }
        if (this.data.age == 0) {
          that.setData({
            [index]: value,
            [count]: value_num,
          });
        } else if (this.data.age == 1) {
          that.setData({
            [index]: value,
            [count]: value2,
            [count1]: number1,
          });
        }

      }

    }

    for (i = 0; i < this.data.line[this.data.number] * this.data.column[this.data.number]; i++) {
      if (this.data.age == 0) {
        if (this.data.number == 0) {
          if (Number(this.data.num[i]) == Number(this.data.age1_question)) {
            that.setData({
              count: this.data.count + 1,
            });
          }
        } else if (this.data.number == 1) {
          if ((Number(this.data.num[i]) == Number(this.data.age1_question)) && (Number(this.data.ans_num[i]) == Number(this.data.age1_question_number))) {
            that.setData({
              count: this.data.count + 1,
            });
          }
        } else if (this.data.number == 2) {
          if ((Number(this.data.num[i]) == Number(this.data.age1_question)) && (Number(this.data.ans_num[i]) == Number(this.data.age2_question))) {
            that.setData({
              count: this.data.count + 1,
            });
          }
        }

      } else if (this.data.age == 1) {
        if (this.data.number == 0) {
          if (Number(this.data.num[i]) == Number(this.data.age1_question)) {
            that.setData({
              count: this.data.count + 1,
            });
          }
        } else if (this.data.number == 1) {
          if ((Number(this.data.num[i]) == Number(this.data.age1_question)) && (Number(this.data.ans_num[i]) == Number(this.data.age2_question))) {
            that.setData({
              count: this.data.count + 1,
            });
          }
        } else if (this.data.number == 2) {
          if ((Number(this.data.num[i]) == Number(this.data.age1_question)) && (Number(this.data.ans_num[i]) == Number(this.data.age2_question)) && (Number(this.data.ans_num1[i]) == Number(this.data.age2_question_number))) {
            that.setData({
              count: this.data.count + 1,
            });
          }
        }

      }
    }
    console.log("count : " + this.data.count)
  },
  //选择图片
  change: function (e) {
    var that = this;
    var i = 0;
    i = Number(e.target.dataset.name)
    console.log("i : " + i)
    let index = "bg[" + i + "]";
    let indexflag = "flag[" + i + "]";
    if (this.data.flag[i] == 0) {
      that.setData({
        [index]: false,
        [indexflag]: 1,
      })
    } else {
      that.setData({
        [index]: true,
        [indexflag]: 0,
      })
    }
    console.log("flag: " + this.data.flag)
  },

  finish: function (e) {
    this.sum();
    this.setData({
      finishClick: true
    })
    util.closeCountDown(this)
    console.log("下一题")
    var that = this;
    if (this.data.number == 0) {
      wx.showModal({
        title: '练习结束',
        content: '测试要开始啦，请集中注意力进行测试',
        confirmText: '开始测试',
        cancelText: '再次尝试',
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            console.log('用户点击确定')
            var Num = that.data.number;
            Num = Num + 1;
            that.setData({
              number: Num,
            })
            that.init()
            that.initnum()
          } else if (res.cancel) {
            that.init()
          }
        }
      })
    } else {
      var title;
      var content;
      if (this.data.number == 1) {
        title = '完成';
        content = '稍微休息一下，还有一题，继续集中注意力完成下一题'
      } else if (this.data.number == 2) {
        title = '完成';
        content = '稍微休息一下，进入下一个题目'
      }
      var Num = this.data.number;
      Num = Num + 1;
      this.setData({
        number: Num,
      })
      wx.showModal({
        title: title,
        content: content,
        confirmText: '下一题',
        showCancel: false,
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            console.log('用户点击确定')
            if (that.data.number == 3) {
              wx.redirectTo({
                url: '../../planning-test/rule4.1/rule4.1'
              })
            } else {
              that.init()
              that.initnum()
            }
          }
        }
      })
    }
  },
  start: function (e) {
    this.setData({
      start: true
    })
    this.initnum()
  }

})