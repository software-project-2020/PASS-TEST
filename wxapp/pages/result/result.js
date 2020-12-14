// pages/result/result.js
var util = require('../../utils/util')

var numCount = 4;
var numSlot = 3;
var mW = 800;
var mCenter = mW / 5; //中心点
var mAngle = Math.PI * 2 / numCount; //角度
var mRadius = mCenter - 60; //半径(减去的值用于给绘制的文本留空间)
//获取Canvas
var radCtx = wx.createCanvasContext("radarCanvas")
var ctx = wx.createCanvasContext('myCanvas')
//雷达图数据
var plan_mygrade = 66;
var plan_avggrade = 88;
var attention_mygrade = 88;
var attention_avggrade = 24;
var simultaneous_mygrade = 90;
var simultaneous_avggrade = 49;
var successive_mygrade = 30;
var successive_avggrade = 60;
Page({

  data: {
    
    triggered: false,
    stepText: 5,
    my: [
      ["注意", attention_mygrade],
      ["继时性", successive_mygrade],
      ["计划", plan_mygrade],
      ["同时性", simultaneous_mygrade],
    ],
    avg: [
      ["注意", attention_avggrade],
      ["继时性", successive_avggrade],
      ["计划", plan_avggrade],
      ["同时性", simultaneous_avggrade],
    ],
    people: 100,
    plan: 8,
    attention: 28,
    simultaneous: 58,
    successive: 8,

    show: false,
    plan1_time: 9,
    plan1_count: 3,
    plan2_time: 16,
    plan2_count: 4,
    plan3_time: 25,
    plan3_count: 5,

    attention1_right: 9,
    attention1_sum: 20,
    attention2_right: 15,
    attention2_sum: 20,

    simultaneous1_right: 15,
    simultaneous1_sum: 20,
    simultaneous2_right: 15,
    simultaneous2_sum: 20,

    successive1_right: 15,
    successive1_sum: 20,
    successive2_right: 15,
    successive2_sum: 20,
    successive3_right: 15,
    successive3_sum: 20,
    isOpacity: true,
  },
  onReady: function () {
    setTimeout(() => {
      this.setData({
        triggered: true,
      })
    }, 1000)
    //雷达图
    this.drawRadar()
    var grade = ['非常优秀', '优秀', '良好', '合格', '一般']
    var name = ['计划的', '注意的', '同时性', '继时性']
    var rank = [this.data.plan, this.data.attention, this.data.simultaneous, this.data.successive]
    var max = this.data.plan;
    var min = this.data.plan;
    var minIndex = 0;
    var maxIndex = 0;
    for (var i = 0; i < rank.length; i++) {
      if (rank[i] < min) {
        min = rank[i]
        minIndex = i;
      } else if (rank[i] > max) {
        max = rank[i]
        maxIndex = i;
      }
      //暂时没有考虑相等的情况
    }
    var plan_percentage = (this.data.plan * 1.0 / this.data.people) * 100;
    var attention_percentage = this.data.attention * 1.0 / this.data.people * 100;
    var simultaneous_percentage = this.data.simultaneous * 1.0 / this.data.people * 100;
    var successive_percentage = this.data.successive * 1.0 / this.data.people * 100;
    var plan_grade;
    var attention_grade;
    var simultaneous_grade;
    var successive_grade;
    if (plan_percentage > 0 && plan_percentage < 10) {
      plan_grade = grade[0]
    } else if (plan_percentage >= 10 && plan_percentage <= 30) {
      plan_grade = grade[1]
    } else if (plan_percentage > 30 && plan_percentage <= 60) {
      plan_grade = grade[2]
    } else if (plan_percentage > 60 && plan_percentage <= 90) {
      plan_grade = grade[3]
    } else if (plan_percentage > 60 && plan_percentage <= 100) {
      plan_grade = grade[4]
    }

    if (attention_percentage > 0 && attention_percentage < 10) {
      attention_grade = grade[0]
    } else if (attention_percentage >= 10 && attention_percentage <= 30) {
      attention_grade = grade[1]
    } else if (attention_percentage > 30 && attention_percentage <= 60) {
      attention_grade = grade[2]
    } else if (attention_percentage > 60 && attention_percentage <= 90) {
      attention_grade = grade[3]
    } else if (attention_percentage > 60 && attention_percentage <= 100) {
      attention_grade = grade[4]
    }

    if (simultaneous_percentage > 0 && simultaneous_percentage < 10) {
      simultaneous_grade = grade[0]
    } else if (simultaneous_percentage >= 10 && simultaneous_percentage <= 30) {
      simultaneous_grade = grade[1]
    } else if (simultaneous_percentage > 30 && simultaneous_percentage <= 60) {
      simultaneous_grade = grade[2]
    } else if (simultaneous_percentage > 60 && simultaneous_percentage <= 90) {
      simultaneous_grade = grade[3]
    } else if (simultaneous_percentage > 60 && simultaneous_percentage <= 100) {
      simultaneous_grade = grade[4]
    }

    if (successive_percentage > 0 && successive_percentage < 10) {
      successive_grade = grade[0]
    } else if (successive_percentage >= 10 && successive_percentage <= 30) {
      successive_grade = grade[1]
    } else if (successive_percentage > 30 && successive_percentage <= 60) {
      successive_grade = grade[2]
    } else if (successive_percentage > 60 && successive_percentage <= 90) {
      successive_grade = grade[3]
    } else if (successive_percentage > 60 && successive_percentage <= 100) {
      successive_grade = grade[4]
    }

    this.setData({
      max: name[minIndex],
      min: name[maxIndex],
      plan_grade: plan_grade,
      plan_percentage: Math.ceil(plan_percentage),
      attention_grade: attention_grade,
      attention_percentage: Math.ceil(attention_percentage),
      simultaneous_grade: simultaneous_grade,
      simultaneous_percentage: Math.ceil(simultaneous_percentage),
      successive_grade: successive_grade,
      successive_percentage: Math.ceil(successive_percentage)
    })
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res);
        console.log(res.windowWidth);
        console.log(res.windowHeight);
        that.setData({
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight,
          deviceWidthLook: res.windowWidth*0.9,
          deviceHeightLook: res.windowHeight*0.78
        })
      }
    })

  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 雷达图
  drawRadar: function () {
    var that = this;
    var my = that.data.my;
    var avg = that.data.avg;
    //调用
    that.drawEdge()
    that.drawLinePoint()
    //设置数据
    that.drawRegion(my, 'rgba(71, 92, 177, 0.8)') //第一个人的
    that.drawRegion(avg, 'rgba(247 , 153, 31, 0.8)') //第二个人
    //设置文本数据
    that.drawTextCans(my)
    //设置节点
    that.drawCircle(my, 'rgba(71, 92, 177, 1)')
    that.drawCircle(avg, 'rgba(247 , 153, 31, 1)')
    //开始绘制
    radCtx.draw()
    ctx.draw()
  },
  // 绘制4条边
  drawEdge: function () {
    radCtx.setStrokeStyle('rgba(0 , 0, 0, 0.5)')
    radCtx.setLineWidth(0.5) //设置线宽
    ctx.setStrokeStyle('rgba(0 , 0, 0, 0.5)')
    ctx.setLineWidth(0.5) //设置线宽
    for (var i = 0; i < numSlot; i++) {
      //计算半径
      radCtx.beginPath()
      ctx.beginPath()
      var rdius = mRadius / numSlot * (i + 1)
      //画4条线段
      for (var j = 0; j < numCount; j++) {
        //坐标
        var x = mCenter + rdius * Math.cos(mAngle * j);
        var y = mCenter + rdius * Math.sin(mAngle * j);
        radCtx.lineTo(x, y);
        ctx.lineTo(x, y);
      }
      radCtx.closePath()
      radCtx.stroke()
      ctx.closePath()
      ctx.stroke()
    }
  },
  // 绘制连接点
  drawLinePoint: function () {
    radCtx.beginPath();
    ctx.beginPath();
    for (var k = 0; k < numCount; k++) {
      var x = mCenter + mRadius * Math.cos(mAngle * k);
      var y = mCenter + mRadius * Math.sin(mAngle * k);

      radCtx.moveTo(mCenter, mCenter);
      radCtx.lineTo(x, y);
      ctx.moveTo(mCenter, mCenter);
      ctx.lineTo(x, y);
    }
    radCtx.stroke();
    ctx.stroke();
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion: function (mData, color) {
    radCtx.setStrokeStyle(color)
    radCtx.setLineWidth(2) //设置线宽
    radCtx.beginPath();
    ctx.setStrokeStyle(color)
    ctx.setLineWidth(2) //设置线宽
    ctx.beginPath();
    for (var m = 0; m < numCount; m++) {
      var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;

      radCtx.lineTo(x, y);
      ctx.lineTo(x, y);
    }
    radCtx.closePath();
    radCtx.stroke()
    ctx.closePath();
    ctx.stroke()
  },
  //绘制文字
  drawTextCans: function (mData) {
    radCtx.setFillStyle("black")
    radCtx.font = 'bold 17px cursive' //设置字体
    ctx.setFillStyle("black")
    ctx.font = 'bold 17px cursive' //设置字体
    for (var n = 0; n < numCount; n++) {
      var x = mCenter + mRadius * Math.cos(mAngle * n);
      var y = mCenter + mRadius * Math.sin(mAngle * n);
      //通过不同的位置，调整文本的显示位置
      if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
        radCtx.fillText(mData[n][0], x + 5, y + 5);
        ctx.fillText(mData[n][0], x + 5, y + 5);
      } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 7, y + 5);
        ctx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 7, y + 5);
      } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 5, y);
        ctx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 5, y);
      } else {
        radCtx.fillText(mData[n][0], x + 7, y + 2);
        ctx.fillText(mData[n][0], x + 7, y + 2);
      }
    }
  },
  //画点
  drawCircle: function (mData, color) {
    var r = 3; //设置节点小圆点的半径
    for (var i = 0; i < numCount; i++) {
      var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * i) * mData[i][1] / 100;

      radCtx.beginPath();
      radCtx.arc(x, y, r, 0, Math.PI * 2);
      radCtx.fillStyle = color;
      radCtx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  //是否显示做题详情
  show: function (e) {
    this.setData({
      show: true,
    })
  },

  writeCanvas() {
    var that = this;
    ctx.setFillStyle('white')

    //雷达图
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 22)
    ctx.setFillStyle('#999999')
    ctx.fillText('雷达图', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 50)

    this.drawRadar()

    //雷达图图标
    ctx.setFontSize((that.data.deviceWidth / 750) * 22)
    ctx.setFillStyle('#666666')
    ctx.fillText('我的成绩', (that.data.deviceWidth / 750) * 210, (that.data.deviceHeight / 1334) * 650)
    ctx.setFillStyle('#666666')
    ctx.fillText('平均成绩', (that.data.deviceWidth / 750) * 410, (that.data.deviceHeight / 1334) * 650)
    ctx.fillStyle = '#475CB1';
    ctx.fillRect((that.data.deviceWidth / 750) * 170, (that.data.deviceHeight / 1334) * 630, 10, 10)
    ctx.fillStyle = '#F7991F';
    ctx.fillRect((that.data.deviceWidth / 750) * 370, (that.data.deviceHeight / 1334) * 630, 10, 10)
    //排名
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 22)
    ctx.setFillStyle('#666666')
    ctx.fillText('排名', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 700)

    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('计划', (that.data.deviceWidth / 750) * 85, (that.data.deviceHeight / 1334) * 780)
    ctx.fillText('注意', (that.data.deviceWidth / 750) * 265, (that.data.deviceHeight / 1334) * 780)
    ctx.fillText('同时性', (that.data.deviceWidth / 750) * 445, (that.data.deviceHeight / 1334) * 780)
    ctx.fillText('继时性', (that.data.deviceWidth / 750) * 625, (that.data.deviceHeight / 1334) * 780)

    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.plan + ' / ' + this.data.people, (that.data.deviceWidth / 750) * 75, (that.data.deviceHeight / 1334) * 880)
    ctx.fillText(this.data.attention + ' / ' + this.data.people, (that.data.deviceWidth / 750) * 255, (that.data.deviceHeight / 1334) * 880)
    ctx.fillText(this.data.simultaneous + ' / ' + this.data.people, (that.data.deviceWidth / 750) * 435, (that.data.deviceHeight / 1334) * 880)
    ctx.fillText(this.data.successive + ' / ' + this.data.people, (that.data.deviceWidth / 750) * 615, (that.data.deviceHeight / 1334) * 880)

    ctx.setStrokeStyle("#E5E5E5");
    //画横线
    for (var i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo((that.data.deviceWidth / 750) * 30, that.data.deviceHeight / 1337 * (i * 100 + 720));
      ctx.lineTo(that.data.deviceWidth, that.data.deviceHeight / 1337 * (i * 100 + 720));
      ctx.stroke();
    }
    //画竖线
    for (var i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(that.data.deviceWidth / 750 * (i * 180 + 30), (that.data.deviceHeight / 1334) * 720);
      ctx.lineTo(that.data.deviceWidth / 750 * (i * 180 + 30), (that.data.deviceHeight / 1334) * 920);
      ctx.stroke();
    }

    //做题详情
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 22)
    ctx.setFillStyle('#666666')
    ctx.fillText('做题详情', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 1000)

    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('题目', (that.data.deviceWidth / 750) * 180, (that.data.deviceHeight / 1334) * 1115)
    ctx.fillText('做题详情', (that.data.deviceWidth / 750) * 520, (that.data.deviceHeight / 1334) * 1115)

    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('舒尔特方块', (that.data.deviceWidth / 750) * 160, (that.data.deviceHeight / 1334) * 1215)
    ctx.fillText(this.data.plan2_count + " * " + this.data.plan2_count + " : " + this.data.plan2_time + " s", (that.data.deviceWidth / 750) * 510, (that.data.deviceHeight / 1334) * 1198)
    ctx.fillText(this.data.plan3_count + " * " + this.data.plan3_count + " : " + this.data.plan3_time + " s", (that.data.deviceWidth / 750) * 510, (that.data.deviceHeight / 1334) * 1231)
    ctx.fillText('寻找数字', (that.data.deviceWidth / 750) * 160, (that.data.deviceHeight / 1334) * 1315)
    ctx.fillText(this.data.attention1_right + " / " + this.data.attention1_sum, (that.data.deviceWidth / 750) * 520, (that.data.deviceHeight / 1334) * 1315)
    ctx.fillText('接受性注意', (that.data.deviceWidth / 750) * 160, (that.data.deviceHeight / 1334) * 1415)
    ctx.fillText(this.data.attention2_right + " / " + this.data.attention2_sum, (that.data.deviceWidth / 750) * 520, (that.data.deviceHeight / 1334) * 1415)
    ctx.fillText('言语加工', (that.data.deviceWidth / 750) * 160, (that.data.deviceHeight / 1334) * 1515)
    ctx.fillText(this.data.simultaneous1_right + " / " + this.data.simultaneous1_sum, (that.data.deviceWidth / 750) * 520, (that.data.deviceHeight / 1334) * 1515)
    ctx.fillText('渐进矩阵', (that.data.deviceWidth / 750) * 160, (that.data.deviceHeight / 1334) * 1615)
    ctx.fillText(this.data.simultaneous2_right + " / " + this.data.simultaneous2_sum, (that.data.deviceWidth / 750) * 520, (that.data.deviceHeight / 1334) * 1615)
    ctx.fillText('单词序列', (that.data.deviceWidth / 750) * 160, (that.data.deviceHeight / 1334) * 1715)
    ctx.fillText(this.data.successive1_right + " / " + this.data.successive1_sum, (that.data.deviceWidth / 750) * 520, (that.data.deviceHeight / 1334) * 1715)
    ctx.fillText('句子提问', (that.data.deviceWidth / 750) * 160, (that.data.deviceHeight / 1334) * 1815)
    ctx.fillText(this.data.successive2_right + " / " + this.data.successive2_sum, (that.data.deviceWidth / 750) * 520, (that.data.deviceHeight / 1334) * 1815)
    ctx.fillText('记忆广度', (that.data.deviceWidth / 750) * 160, (that.data.deviceHeight / 1334) * 1915)
    ctx.fillText(this.data.successive3_right + " / " + this.data.successive3_sum, (that.data.deviceWidth / 750) * 520, (that.data.deviceHeight / 1334) * 1915)

    //画横线
    for (var i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo((that.data.deviceWidth / 750) * 30, that.data.deviceHeight / 1334 * (i * 100 + 1050));
      ctx.lineTo(that.data.deviceWidth, that.data.deviceHeight / 1334 * (i * 100 + 1050));
      ctx.stroke();
    }
    //画竖线
    for (var i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(that.data.deviceWidth / 750 * (i * 358 + 30), (that.data.deviceHeight / 1334) * 1950);
      ctx.lineTo(that.data.deviceWidth / 750 * (i * 358 + 30), (that.data.deviceHeight / 1334) * 1050);
      ctx.stroke();
    }

    //分析与建议
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 22)
    ctx.setFillStyle('#666666')
    ctx.fillText('分析与建议', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2030)

    //第一段
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('根据上述排名，你的', (that.data.deviceWidth / 750) * 80, (that.data.deviceHeight / 1334) * 2100)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.max, (that.data.deviceWidth / 750) * 305, (that.data.deviceHeight / 1334) * 2100)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('加工能力比较好，你的', (that.data.deviceWidth / 750) * (305 + 25 * this.data.max.length), (that.data.deviceHeight / 1334) * 2100)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.min, (that.data.deviceWidth / 750) * (555 + 25 * this.data.max.length), (that.data.deviceHeight / 1334) * 2100)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('加', (that.data.deviceWidth / 750) * (555 + 25 * this.data.max.length + 25 * this.data.min.length), (that.data.deviceHeight / 1334) * 2100)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('工能力比较差。', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2150)
    //计划
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('同龄人中，你的计划加工能力达到了', (that.data.deviceWidth / 750) * 80, (that.data.deviceHeight / 1334) * 2200)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.plan_grade, (that.data.deviceWidth / 750) * 480, (that.data.deviceHeight / 1334) * 2200)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('水平，约有', (that.data.deviceWidth / 750) * (480 + 25 * this.data.plan_grade.length), (that.data.deviceHeight / 1334) * 2200)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.plan_percentage + '%', (that.data.deviceWidth / 750) * (605 + 25 * this.data.plan_grade.length), (that.data.deviceHeight / 1334) * 2200)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('的人处于这一水平。计划加工能力是为解决问题、达到目标而使', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2240)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('用和修改的一组决策或策略，它是指向某个目标的行动过程的预', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2280)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('先决定。', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2320)
    //注意
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('你的注意加工能力达到了', (that.data.deviceWidth / 750) * 80, (that.data.deviceHeight / 1334) * 2370)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.attention_grade, (that.data.deviceWidth / 750) * 355, (that.data.deviceHeight / 1334) * 2370)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('水平，约有', (that.data.deviceWidth / 750) * (355 + 25 * this.data.attention_grade.length), (that.data.deviceHeight / 1334) * 2370)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.attention_percentage + '%', (that.data.deviceWidth / 750) * (480 + 25 * this.data.attention_grade.length), (that.data.deviceHeight / 1334) * 2370)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    if (this.data.attention_percentage < 10) {
      ctx.fillText('的人处于这', (that.data.deviceWidth / 750) * (520 + 25 * this.data.attention_grade.length), (that.data.deviceHeight / 1334) * 2370)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('一水平。维持性注意是对单一信息源在连续的一段时间内的注意', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2410)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('保持，但是对注意的评估不包括集中和分配时间的能力。', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2450)
    } else {
      ctx.fillText('的人处于这一', (that.data.deviceWidth / 750) * (535 + 25 * this.data.attention_grade.length), (that.data.deviceHeight / 1334) * 2370)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('水平。维持性注意是对单一信息源在连续的一段时间内的注意保', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2410)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('持，但是对注意的评估不包括集中和分配时间的能力。', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2450)
    }
    //同时性
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('你的同时性加工能力达到了', (that.data.deviceWidth / 750) * 80, (that.data.deviceHeight / 1334) * 2500)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.simultaneous_grade, (that.data.deviceWidth / 750) * 380, (that.data.deviceHeight / 1334) * 2500)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('水平，约有', (that.data.deviceWidth / 750) * (380 + 25 * this.data.simultaneous_grade.length), (that.data.deviceHeight / 1334) * 2500)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.simultaneous_percentage + '%', (that.data.deviceWidth / 750) * (505 + 25 * this.data.simultaneous_grade.length), (that.data.deviceHeight / 1334) * 2500)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    if (this.data.simultaneous_percentage < 10) {
      ctx.fillText('的人处于', (that.data.deviceWidth / 750) * (545 + 25 * this.data.simultaneous_grade.length), (that.data.deviceHeight / 1334) * 2500)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('这一水平。评估同时性编码的目标是要测量人们联结和整合离散', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2540)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('的片断信息的能力——即把两个或两个以上的信息片断加工为一', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2580)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('个片断。', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2620)
    } else {
      ctx.fillText('的人处于这', (that.data.deviceWidth / 750) * (560 + 25 * this.data.simultaneous_grade.length), (that.data.deviceHeight / 1334) * 2500)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('一水平。评估同时性编码的目标是要测量人们联结和整合离散的', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2540)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('片断信息的能力——即把两个或两个以上的信息片断加工为一个', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2580)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('片断。', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2620)
    }
    //继时性
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('你的继时性加工能力达到了', (that.data.deviceWidth / 750) * 80, (that.data.deviceHeight / 1334) * 2670)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.successive_grade, (that.data.deviceWidth / 750) * 380, (that.data.deviceHeight / 1334) * 2670)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('水平，约有', (that.data.deviceWidth / 750) * (380 + 25 * this.data.successive_grade.length), (that.data.deviceHeight / 1334) * 2670)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.successive_percentage + '%', (that.data.deviceWidth / 750) * (505 + 25 * this.data.simultaneous_grade.length), (that.data.deviceHeight / 1334) * 2670)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    if (this.data.successive_percentage < 10) {
      ctx.fillText('的人处于', (that.data.deviceWidth / 750) * (545 + 25 * this.data.successive_grade.length), (that.data.deviceHeight / 1334) * 2670)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('这一水平。测试继时性编码的目的是为了评价人们以特定的顺', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2710)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('序保持信息的技能。', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2750)
    } else {
      ctx.fillText('的人处于这', (that.data.deviceWidth / 750) * (560 + 25 * this.data.successive_grade.length), (that.data.deviceHeight / 1334) * 2670)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('一水平。测试继时性编码的目的是为了评价人们以特定的顺序保', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2710)
      ctx.font = `normal 40px sans-serif`;
      ctx.setFontSize((that.data.deviceWidth / 750) * 25)
      ctx.setFillStyle('#000000')
      ctx.fillText('持信息的技能。', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 2750)
    }

    //建议
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('建议：可以适当提高', (that.data.deviceWidth / 750) * 80, (that.data.deviceHeight / 1334) * 2800)
    ctx.font = `bold 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText(this.data.min, (that.data.deviceWidth / 750) * 305, (that.data.deviceHeight / 1334) * 2800)
    ctx.font = `normal 40px sans-serif`;
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#000000')
    ctx.fillText('加工能力，更加有助于孩子的成长。', (that.data.deviceWidth / 750) * 380, (that.data.deviceHeight / 1334) * 2800)

    //渲染
    ctx.draw(true, () => {
      that.setData({
        spinning: false
      })
    })
    // ctx.draw()
  },

  savePicutre() {
    var that = this;
    //需要把canvas转成图片后才能保存
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 800,
      height: 3000,
      destWidth: 1600, //2倍关系
      destHeight: 6000, //2倍关系
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          //关键 赋值给变量
          shareImgSrc: res.tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          //shareImgSrc为canvas赋值的图片路径
          filePath: that.data.shareImgSrc,
          success(res) {
            console.log(res);
            wx.showToast({
              title: "保存成功",
              icon: "success",
            })
          },
          fail: function (res) {
            console.log(res)
            if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
              console.log("打开设置窗口");
              that.doAuth()
            }
          }
        })

      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: "保存失败，请查看网络连接是否正常",
          icon: "none",
        })
      }
    }, this)
  },

  //保存图片 
  save: function (e) {
    this.writeCanvas();
    wx.showToast({
      title: "保存中",
      icon: "loading",
    })
    this.savePicutre();
  },

  // 获取授权
  doAuth() {
    wx.showModal({
      title: '获取授权',
      content: '您是否同意重新授权保存图片',
      cancelText: '不同意',
      confirmText: '好',
      confirmColor: '#21c0ae',
      success: function (res) {
        if (res.confirm) { // 点击确认
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                console.log("获取权限成功，再次点击图片保存到相册")
              } else {
                console.log("获取权限失败")
              }
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      }
    })
  },

  return:function(e){
    wx.navigateTo({
      url: '../../pages/start/start'
    })
  }

})