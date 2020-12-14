// pages/Planning/test4.1/test4.1.js
// util.closeCountDown(this)//关闭计时器
var util = require('../../../utils/util.js')
var testutil = require('../../../utils/testutil.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    age: 5,
    level: 1,//当前游戏难度
    Alltime: 30,//规定最长完成时间
    startdifficulty: 3,//当前游戏连续词语个数
    testcount: 0,//当前难度测试题数
    list_pic: ["../../../image/lyq/animal/dog.png", "../../../image/lyq/animal/eyu.png", "../../../image/lyq/animal/fog.png", "../../../image/lyq/animal/sheep.png",
      "../../../image/lyq/animal/bear.png", "../../../image/lyq/animal/ciwei.png", "../../../image/lyq/animal/elephant.jpg", "../../../image/lyq/animal/duck.png"],
    list_complex: ["苹果", "香蕉", "橘子", "香梨", "葡萄", "冬枣", "啤酒", "汉堡", "可乐"],//所有词语
    mixlist: [],//随机抽取nowdifficulty个字，显示的序列(正确序列)
    mixlist_mix: [],//打乱之后的字词，排序界面的序列
    intervaltime: 1800,//毫秒
    order: [],//测试者排的序列
    wrongnum: 0,//连续错误题数
    score: 0,//得分
    isTry: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    testutil.getconfiguration(0, 'S21', (res) => {
      console.log(res)
    })
    this.intinum()
  },
  intinum() {
    var mixlist = this.data.mixlist;
    var mixlist_mix = this.data.mixlist_mix;
    var order = this.data.order;
    var list_complex = this.data.list_complex;
    var list;
    var age = this.data.age
    var list_pic = this.data.list_pic
    if (age <= 10)
      this.setData({
        isLowage: true,
        startdifficulty:3
      })
    else {
      this.setData({
        isLowage: false,
        startdifficulty:5
      })
    }
    if (this.data.isTry == true) {
      var that = this
      wx.showModal({
        title: '注意',
        content: '此次为尝试机会，不计入测试成绩',
        confirmText: '开始尝试',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            that.setData({
              begin: true
            })
            that.changeletter()
          }
        }
      })
    }
    if (this.data.level == 1) {
      if (this.data.isLowage == true) {
        list = list_pic.slice()
        this.setData({
          nowdifficulty: this.data.startdifficulty,//当前游戏难度，连续几个词
        })
      }
      else {
        list = list_complex.slice()
        this.setData({
          nowdifficulty: this.data.startdifficulty,//当前游戏难度，连续几个词
        })
      }
    } else if (this.data.level == 2) {
      if (this.data.isLowage == true) {
        list = list_pic.slice()
        this.setData({
          nowdifficulty: this.data.startdifficulty+1,//当前游戏难度，连续几个词
        })
      }
      else {
        list = list_complex.slice()
        this.setData({
          nowdifficulty: this.data.startdifficulty+1,//当前游戏难度，连续几个词
        })
      }
    } else if (this.data.level == 3) {
      if (this.data.isLowage == true) {
        list = list_pic.slice()
        this.setData({
          nowdifficulty: this.data.startdifficulty+2,//当前游戏难度，连续几个词
        })
      }
      else {
        list = list_complex.slice()
        this.setData({
          nowdifficulty: this.data.startdifficulty+2,//当前游戏难度，连续几个词
        })
      }
    }
    if (this.data.testcount % 2 == 1) {
      this.setData({
        intervaltime: 600
      })
    } else {
      this.setData({
        intervaltime: 1800
      })
    }
    this.setData({
      Costtime: 0,//提交时花费的时间
      showover: false,//字词是否全部显示完毕
      isSubmit: false,//是否有效提交，（不作答提交无效）
      num: 0,//用户排序时当前排的序号
      shownum: 0,//字词显示时，当前显示的是第几个数
      begin: false
    }),
    mixlist.splice(0, mixlist.length);
    mixlist_mix.splice(0, mixlist_mix.length);
    order.splice(0, order.length);
    var mixlist = this.data.mixlist
    for (var i = 0; i < this.data.nowdifficulty; i++) {
      var j = Math.floor(Math.random() * list.length);
      var m = Math.floor(Math.random() * 550) - 300
      var item = {
        "index": i,
        "value": list[j],
        "isClick": false,
        "clicknum": 0,
        "marginleft": m
      }
      mixlist.push(item)
      list.splice(j, 1)
    }
    this.setData({
      mixlist: mixlist
    })
    var mixlist_mix = this.data.mixlist.slice()
    console.log(this.data.mixlist)
    shuffle(mixlist_mix);
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
    this.setData({
      mixlist_mix: mixlist_mix
    })
  },
  changeletter() {
    let shownum = this.data.shownum
    let mix = this.data.mixlist.slice()
    var that = this
    var a = setInterval(function () {
      shownum = shownum + 1
      that.setData({
        mixlist: mix,
        shownum: shownum,
      })
      if (shownum == that.data.nowdifficulty) {
        clearInterval(a)
        that.setData({
          showover: true
        })
        util.initCountDown(that, that.data.Alltime, 0.1)
      }
    }, that.data.intervaltime) //循环时间 这里是5秒

  },
  timeout: function () {
    if (this.data.isTry == true) {
      var that = this
      wx.showModal({
        title: '糟糕',
        content: '时间花光了',
        confirmText: '开始测试',
        cancelText: '再次尝试',
        success: function (res) {
          if (res.cancel) {//这里是点击了确定以后
            console.log('再次尝试')
            that.intinum()
          }
          else if (res.confirm) {
            that.setData({
              isTry: false
            })
            that.ChangeNavigate()
          }
        }
      })
    } else {
      var testcount = this.data.testcount
      var level = this.data.level
      var wrongnum = this.data.wrongnum
      this.setData({
        wrongnum: wrongnum + 1,
        testcount: testcount + 1
      })
      if (this.data.testcount == 2) {
        this.setData({
          level: level + 1,
          testcount: 0
        })
      }
      var that = this
      wx.showModal({
        title: '糟糕',
        content: '时间花光了',
        confirmText: '下一题',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            that.ChangeNavigate()
          }
        }
      })
    }
  },
  ChangeNavigate() {
    if (this.data.level == 4 || this.data.wrongnum == 2) {
      wx.navigateTo({
        url: '/pages/Planning/test1/test1',//跳转下个测试，待修改
      })
    }
    else {
      this.intinum()
      this.changeletter()
    }
  },
  order: function (e) {
    if (this.data.isSubmit == false) {//提交过之后不能再排序
      var i;
      var num = this.data.num
      var that = this
      let order = this.data.order
      let mixlist = this.data.mixlist
      let mixlist_mix = this.data.mixlist_mix
      var value, index;
      i = Number(e.target.dataset.name)
      for (var k = 0; k < mixlist_mix.length; k++) {
        if (mixlist_mix[k].index == i) {
          value = mixlist_mix[k].value
        }
      }
      for (var k = 0; k < mixlist_mix.length; k++) {
        if (value == mixlist_mix[k].value) {
          index = k
        }
      }
      //如果已经点击过，不能push到order里（应该pop出来），没有点击过则push到order里
      if (mixlist_mix[index].isClick == false) {
        order.push(mixlist[i])
        this.setData({
          [`mixlist_mix[${index}].isClick`]: true,
          [`mixlist_mix[${index}].clicknum`]: num + 1,
          num: num + 1
        })
      } else {
        for (var k = 0; k < order.length; k++) {
          if (order[k].value == value) {
            order.splice(k, 1)
          }
        }
        for (var k = 0; k < mixlist_mix.length; k++) {
          if (mixlist_mix[k].clicknum > mixlist_mix[index].clicknum) {
            that.setData({
              [`mixlist_mix[${k}].clicknum`]: mixlist_mix[k].clicknum - 1,
              num: num - 1
            })
          }
        }
        this.setData({
          [`mixlist_mix[${index}].isClick`]: false,
          [`mixlist_mix[${index}].clicknum`]: 0,
          num: num - 1
        })
      }
      console.log(order)
    }
  },
  submit: function () {
    let order = this.data.order
    //没有全部排序，不能提交
    if (order.length < this.data.nowdifficulty && this.data.isSubmit == false) {
      wx.showModal({
        title: '抱歉',
        content: '没有选择全部',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
          }
        }
      })
    }
    //全部排序完毕，可以提交
    else if (this.data.isSubmit == false && order.length == this.data.nowdifficulty) {
      util.closeCountDown(this)//关闭计时器
      let mixlist = this.data.mixlist
      var isSubmit = this.data.isSubmit
      for (var j = 0; j < mixlist.length; j++) {
        if (order.length == 0||mixlist[j].value != order[j].value)
          break
      }
      if (j == mixlist.length) {
        //level为下一关level，testcount从0开始计算
        var that = this;
        if (this.data.isTry == false) {
          var testcount = this.data.testcount
          var level = this.data.level
          var wrongnum = this.data.wrongnum
          var score = this.data.score
          this.setData({
            testcount: testcount + 1,
            wrongnum: 0,
            score: score + 1
          })
          if (this.data.testcount == 2) {
            this.setData({
              level: level + 1,
              testcount: 0
            })
          }
          wx.showModal({
            title: '恭喜',
            content: '作答正确',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {//这里是点击了确定以后
                that.ChangeNavigate()
              }
            }
          })
        } else {
          wx.showModal({
            title: '恭喜',
            content: '做答正确',
            confirmText: '开始测试',
            cancelText: '再次尝试',
            success: function (res) {
              if (res.cancel) {//这里是点击了确定以后
                console.log('再次尝试')
                that.intinum()
              }
              else if (res.confirm) {
                that.setData({
                  isTry: false
                })
                console.log(that.data.isTry)
                that.ChangeNavigate()
              }
            }
          })
        }
      }
      else {
        if(this.data.isTry==false){
        var testcount = this.data.testcount
        var level = this.data.level
        var wrongnum = this.data.wrongnum
        this.setData({
          testcount: testcount + 1,
          wrongnum: wrongnum + 1
        })
        if (this.data.testcount == 2) {
          this.setData({
            level: level + 1,
            testcount: 0,
          })
        }
        var that = this;
        wx.showModal({
          title: '抱歉',
          content: '作答错误',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              that.ChangeNavigate()
            }
          }
        })
        }
        else{
          var that = this
          wx.showModal({
            title: '抱歉',
            content: '做答错误',
            confirmText: '开始测试',
            cancelText: '再次尝试',
            success: function (res) {
              if (res.cancel) {//这里是点击了确定以后
                console.log('再次尝试')
                that.intinum()
              }
              else if (res.confirm) {
                that.setData({
                  isTry: false
                })
                console.log(that.data.isTry)
                that.ChangeNavigate()
              }
            }
          })
        }
      }
      this.setData({
        isSubmit: true,
        Costtime: (this.data.Alltime - this.data.countDownNum).toFixed(1)
      })
      // console.log(this.data.Costtime)
      console.log(this.data.score)
    }
  },
})