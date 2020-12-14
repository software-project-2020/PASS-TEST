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
    year : 2020,
    month : 1,
    day : 5,
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
          deviceHeightLook: res.windowHeight*0.82
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
  },
  // 绘制4条边
  drawEdge: function () {
    radCtx.setStrokeStyle('rgba(0 , 0, 0, 0.5)')
    radCtx.setLineWidth(0.5) //设置线宽
    for (var i = 0; i < numSlot; i++) {
      //计算半径
      radCtx.beginPath()
      var rdius = mRadius / numSlot * (i + 1)
      //画4条线段
      for (var j = 0; j < numCount; j++) {
        //坐标
        var x = mCenter + rdius * Math.cos(mAngle * j);
        var y = mCenter + rdius * Math.sin(mAngle * j);
        radCtx.lineTo(x, y);
      }
      radCtx.closePath()
      radCtx.stroke()
    }
  },
  // 绘制连接点
  drawLinePoint: function () {
    radCtx.beginPath();
    for (var k = 0; k < numCount; k++) {
      var x = mCenter + mRadius * Math.cos(mAngle * k);
      var y = mCenter + mRadius * Math.sin(mAngle * k);

      radCtx.moveTo(mCenter, mCenter);
      radCtx.lineTo(x, y);
    }
    radCtx.stroke();
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion: function (mData, color) {
    radCtx.setStrokeStyle(color)
    radCtx.setLineWidth(2) //设置线宽
    radCtx.beginPath();
    for (var m = 0; m < numCount; m++) {
      var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;

      radCtx.lineTo(x, y);
    }
    radCtx.closePath();
    radCtx.stroke()
  },
  //绘制文字
  drawTextCans: function (mData) {
    radCtx.setFillStyle("black")
    radCtx.font = 'bold 17px cursive' //设置字体
    for (var n = 0; n < numCount; n++) {
      var x = mCenter + mRadius * Math.cos(mAngle * n);
      var y = mCenter + mRadius * Math.sin(mAngle * n);
      //通过不同的位置，调整文本的显示位置
      if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
        radCtx.fillText(mData[n][0], x + 5, y + 5);
      } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 7, y + 5);
      } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 5, y);
      } else {
        radCtx.fillText(mData[n][0], x + 7, y + 2);
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
    }
  },

  return:function(e){
    wx.navigateTo({
      url: '../../pages/start/start'
    })
  }

})