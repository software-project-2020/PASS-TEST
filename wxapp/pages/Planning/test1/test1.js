// pages/Planning/test1/test1.js
var util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    l: [{}],
    age: 16,
    nowdifficulty: 3,
    complex: [{}],
    noworder: [],
    showTime: false,
    PassScore:0,
    score_detail:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initnum(this.data.nowdifficulty)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  initnum(size) {
    var nowdifficulty = this.data.nowdifficulty;
    this.setData({
      nowdifficulty: size,
      isPass: false,
      Alltime: 100,
      Passtime: 0,
      Lasttime: 0,
      SeriesCount: 0,
      SeriesAdd: 0,
      GoodTime: 0.8,
      LastIsCorrect: 1,
      isHide: true,
      istry: true,
    })
    var l = this.data.l;
    var complex = this.data.complex;
    var noworder = this.data.noworder;
    l.splice(0, l.length);
    complex.splice(0, complex.length);
    noworder.splice(0, noworder.length);

    for (var i = 0; i < nowdifficulty * nowdifficulty; i++) {
      var item = {
        "value": i + 1,
        "ischoose": false
      }
      l.push(item)
    }
    // console.log(l)
    this.setData({
      l: l,
    })
    function shuffle(arr) {
      var len = arr.length;
      for (var i = 0; i < len - 1; i++) {
        var index = parseInt(Math.random() * (len - i));
        var temp = arr[index];
        arr[index] = arr[len - i - 1];
        arr[len - i - 1] = temp;
      }
      return arr;
    }
    shuffle(l);
    for (var i = 0; i < nowdifficulty; i++) {
      complex.push([])
      for (var j = 0; j < nowdifficulty; j++) {
        complex[i].push(l[i * nowdifficulty + j])
      }
    }
    var i = 0;
    l.forEach(tem => {
      tem.index = i;
      i++;
    })
    // console.log(complex)
    this.setData({
      complex: complex
    })
    if (this.data.nowdifficulty == 3) {
      var that = this
      wx.showModal({
        title: '注意',
        content: '此次为尝试机会，不计入测试成绩',
        confirmText: '开始尝试',
        showCancel: false,
        success: function (res) {
          that.setData({
            showTime: true
          })
          util.initCountDown(that, that.data.Alltime, 0.1)
        }
      })
    }
    else {
      this.setData({
        istry: false
      })
      util.initCountDown(this, this.data.Alltime, 0.1)
    }
  },
  recolor(i) {
    var j;
    var that = this;
    let l = this.data.l;
    let noworder = this.data.noworder;
    for (j = 0; j < this.data.nowdifficulty * this.data.nowdifficulty; j++) {
      l[j].ischoose = false;
    }
    this.setData({
      l: l
    })
    noworder.push(l[i]["value"])
    if (l[i].ischoose == null) {
      that.setData({
        [`l[${i}].ischoose`]: false
      })
    } else {
      that.setData({
        [`l[${i}].ischoose`]: !l[i].ischoose
      })
    }
  },
  timeout: function () {
    this.setData({
      dialogShow: true
    })
    this.setData({
      isPass: true,
      Passtime: this.data.Alltime
    })
    this.CountSore()
    var nowdifficulty = this.data.nowdifficulty
    var that = this
    if (this.data.nowdifficulty == 3) {
      wx.showModal({
        title: '糟糕',
        content: '时间花光了',
        confirmText: '开始测试',
        cancelText: '再次尝试',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
            that.setData({
              nowdifficulty: nowdifficulty + 1
            })
            that.initnum(that.data.nowdifficulty)
          }
          else if (res.cancel) {
            that.initnum(that.data.nowdifficulty)
          }
        }
      })
    } else {
      wx.showModal({
        title: '糟糕',
        content: '时间花光了',
        confirmText: '下一题',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
            that.setData({
              nowdifficulty: nowdifficulty + 1
            })
            if (that.data.nowdifficulty == 6) {
              wx.navigateTo({
                url: '/pages/Planning/rule4.1/rule4.1',
              })
            }else
            that.initnum(that.data.nowdifficulty)
          }
        }
      })
    }
  },
  CountSore() {
    var RightScore;
    RightScore = this.data.noworder.length / (this.data.nowdifficulty * this.data.nowdifficulty) * 100
    var Passtime = this.data.Passtime
    var TimeScore = 0;

    if (this.data.nowdifficulty == 4 && (this.data.age == 5 || this.data.age == 6)) {
      var score4_6 = [{ "age": 6, "costtime": 16, "score": 100 }, { "age": 6, "costtime": 19, "score": 90 }, { "age": 6, "costtime": 21, "score": 80 }, { "age": 6, "costtime": 24, "score": 70 }, { "age": 6, "costtime": 28, "score": 60 }, { "age": 6, "costtime": 32, "score": 50 }, { "age": 6, "costtime": 38, "score": 40 }, { "age": 6, "costtime": 44, "score": 30 }, { "age": 6, "costtime": 46, "score": 20 }, { "age": 6, "costtime": 48, "score": 10 }];
      for (var i = 0; i < score4_6.length; i++) {
        if (Passtime <= score4_6[i].costtime) {
          TimeScore = score4_6[i].score; break;
        }
      }
    }
    else if (this.data.nowdifficulty == 4 && (this.data.age >= 7 && this.data.age <= 11)) {
      var score4_11 = [{ "age": 11, "costtime": 10, "score": 100 }, { "age": 11, "costtime": 16, "score": 90 }, { "age": 11, "costtime": 20, "score": 80 }, { "age": 11, "costtime": 25, "score": 70 }, { "age": 11, "costtime": 28, "score": 60 }, { "age": 11, "costtime": 32, "score": 50 }, { "age": 11, "costtime": 34, "score": 40 }, { "age": 11, "costtime": 38, "score": 30 }, { "age": 11, "costtime": 41, "score": 20 }, { "age": 11, "costtime": 43, "score": 10 }];
      for (var i = 0; i < score4_11.length; i++) {
        if (Passtime <= score4_11[i].costtime) {
          TimeScore = score4_11[i].score; break;
        }
      }
    }
    else if (this.data.nowdifficulty == 4 && (this.data.age >= 12 && this.data.age <= 17)) {
      var score4_17 = score4_17 = [{ "age": 17, "costtime": 7, "score": 100 }, { "age": 17, "costtime": 10, "score": 90 }, { "age": 17, "costtime": 11, "score": 80 }, { "age": 17, "costtime": 14, "score": 70 }, { "age": 17, "costtime": 15, "score": 60 }, { "age": 17, "costtime": 16, "score": 50 }, { "age": 17, "costtime": 18, "score": 40 }, { "age": 17, "costtime": 19, "score": 30 }, { "age": 17, "costtime": 21, "score": 20 }, { "age": 17, "costtime": 23, "score": 10 }];
      for (var i = 0; i < score4_17.length; i++) {
        if (Passtime <= score4_17[i].costtime) {
          TimeScore = score4_17[i].score; break;
        }
      }
    }
    else if (this.data.nowdifficulty == 5 && (this.data.age == 5 || this.data.age == 6)) {
      var score5_6 = [{ "age": 6, "costtime": 26, "score": 100 }, { "age": 6, "costtime": 30, "score": 90 }, { "age": 6, "costtime": 40, "score": 80 }, { "age": 6, "costtime": 48, "score": 70 }, { "age": 6, "costtime": 55, "score": 60 }, { "age": 6, "costtime": 61, "score": 50 }, { "age": 6, "costtime": 66, "score": 40 }, { "age": 6, "costtime": 70, "score": 30 }, { "age": 6, "costtime": 73, "score": 20 }, { "age": 6, "costtime": 75, "score": 10 }];
      for (var i = 0; i < score5_6.length; i++) {
        if (Passtime <= score5_6[i].costtime) {
          TimeScore = score5_6[i].score; break;
        }
      }
    }
    else if (this.data.nowdifficulty == 5 && (this.data.age >= 7 && this.data.age <= 11)) {
      var score5_11 = [{ "age": 11, "costtime": 16, "score": 100 }, { "age": 11, "costtime": 26, "score": 90 }, { "age": 11, "costtime": 32, "score": 80 }, { "age": 11, "costtime": 40, "score": 70 }, { "age": 11, "costtime": 45, "score": 60 }, { "age": 11, "costtime": 50, "score": 50 }, { "age": 11, "costtime": 55, "score": 40 }, { "age": 11, "costtime": 60, "score": 30 }, { "age": 11, "costtime": 65, "score": 20 }, { "age": 11, "costtime": 68, "score": 10 }];
      for (var i = 0; i < score5_11.length; i++) {
        if (Passtime <= score5_11[i].costtime) {
          TimeScore = score5_11[i].score; break;
        }
      }
    }
    else if (this.data.nowdifficulty == 5 && (this.data.age >= 12 && this.data.age <= 17)) {
      var score5_17 = [{ "age": 17, "costtime": 12, "score": 100 }, { "age": 17, "costtime": 16, "score": 90 }, { "age": 17, "costtime": 18, "score": 80 }, { "age": 17, "costtime": 23, "score": 70 }, { "age": 17, "costtime": 24, "score": 60 }, { "age": 17, "costtime": 26, "score": 50 }, { "age": 17, "costtime": 28, "score": 40 }, { "age": 17, "costtime": 30, "score": 30 }, { "age": 17, "costtime": 33, "score": 20 }, { "age": 17, "costtime": 36, "score": 10 }];
      for (var i = 0; i < score5_17.length; i++) {
        if (Passtime <= score5_17[i].costtime) {
          TimeScore = score5_17[i].score; break;
        }
      }
    }
    console.log("时间得分")
    console.log(TimeScore)
    console.log('连击加个数')
    console.log(this.data.SeriesAdd)
    var FinalScore;
    FinalScore = (TimeScore + this.data.SeriesAdd * 0.5) * 0.8 + RightScore * 0.2
    console.log("总得分")
    console.log(FinalScore)
    var PassScore = this.data.PassScore
    var score_detail = this.data.score_detail
    if(this.data.nowdifficulty==4||this.data.nowdifficulty==5){
      PassScore=PassScore+FinalScore
      this.setData({
        PassScore:PassScore
      })
      var item={
        "difficulty":this.data.nowdifficulty,
        "score":Math.round(FinalScore)
      }
      score_detail.push(item)
    }
    if(this.data.nowdifficulty==5){
      this.setData({
        PassScore:(PassScore/2).toFixed(1)
      })
      console.log(this.data.PassScore)
      getApp().globalData.score[0]=Math.round(this.data.PassScore);
      getApp().globalData.scoreDetail[0]=this.data.score_detail;
    }
    // console.log(this.data.PassScore)
    console.log(getApp().globalData.score[0])
    console.log(getApp().globalData.scoreDetail[0])
  },
  change: function (e) {
    var that = this;
    let l = this.data.l;
    let noworder = this.data.noworder;
    var isPass = this.data.isPass;
    var Passtime = this.data.Passtime;
    var Lasttime = this.data.Lasttime;
    var LastIsCorrect = this.data.LastIsCorrect;
    var isHide = this.data.isHide;
    var costtime;
    var i;
    if (isPass == false) {
      i = Number(e.target.dataset.name)
      if (noworder.length == 0 && l[i]["value"] == 1 || (l[i]["value"] == noworder[noworder.length - 1] + 1)) {
        this.recolor(i);
        if (l[i]["value"] == 1) {
          that.setData({
            Lasttime: this.data.countDownNum,
          })
        } else {
          costtime = this.data.Lasttime - this.data.countDownNum
          that.setData({
            Lasttime: this.data.countDownNum,
          })
          //如果两次点击间隔在GoodTime之间，并且两次点击之间没有错误点击
          if (costtime <= this.data.GoodTime && this.data.LastIsCorrect != 0) {
            that.setData({
              SeriesCount: this.data.SeriesCount + 1,
              SeriesAdd: this.data.SeriesAdd + 1,
              isHide: false
            })
          } else {
            that.setData({
              SeriesCount: 0,
              isHide: true
            })
          }
        }
        that.setData({
          LastIsCorrect: 1//设置为正确
        })
      } else {
        console.log("选择错误")
        that.setData({
          SeriesCount: 0,
          LastIsCorrect: 0,
          isHide: true
        })
      }
      that.setData({
        noworder: noworder
      })
    }
    if (this.data.noworder.length == this.data.nowdifficulty * this.data.nowdifficulty && this.data.isPass == false) {
      util.closeCountDown(this)//关闭计时器
      console.log("成功！");
      var nowdifficulty = this.data.nowdifficulty
      this.setData({
        isPass: true,
        Passtime: (this.data.Alltime - this.data.countDownNum).toFixed(1)
      })
      this.CountSore();
      if (this.data.nowdifficulty != 3) {
        wx.showModal({
          title: '恭喜',
          content: '作答正确',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              console.log('用户点击确定')
              that.setData({
                nowdifficulty: nowdifficulty + 1
              })
              if (that.data.nowdifficulty == 6) {
                wx.navigateTo({
                  url: '/pages/Planning/rule4.1/rule4.1',
                })
              }
              else
                that.initnum(that.data.nowdifficulty)
            }
          }
        })
      }
      else {
        wx.showModal({
          title: '恭喜',
          content: '作答正确',
          cancelText: '再次尝试',
          confirmText: '开始测试',
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              console.log('用户点击确定')
              that.setData({
                nowdifficulty: nowdifficulty + 1
              })
              that.initnum(that.data.nowdifficulty)
            }
            else if (res.cancel) {
              that.initnum(that.data.nowdifficulty)
            }
          }
        })
      }
    }
  },
})