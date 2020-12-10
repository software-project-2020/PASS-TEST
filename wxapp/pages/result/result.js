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
    plan: 15,
    attention: 15,
    simultaneous: 15,
    successive: 15,

    show: false,
    plan_time: 25,
    attention1_right: 15,
    attention1_sum: 20,
    attention2_right: 15,
    attention2_sum: 20,
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
          deviceHeight: res.windowHeight
        })
      }
    })

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

      //需要把canvas转成图片后才能保存
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 600,
        height: 750,
        destWidth: 1200, //2倍关系
        destHeight: 1500, //2倍关系
        canvasId: 'radarCanvas',
        success: function (res) {
          console.log(res.tempFilePath);
          that.setData({
            //关键 赋值给变量
            ImgSrc: res.tempFilePath,
            flag: 1,
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
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
  //是否显示做题详情
  show: function (e) {
    this.setData({
      show: true,
    })
  },

  writeCanvas() {
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas');
    var imgPath = that.data.ImgSrc;
    console.log("imgPath : " + imgPath);
    // var imgUserPath = '../../images/user.png';
    // var code = '../../images/code.jpg';
    //绘制图像到画布 x y width height
    ctx.drawImage(imgPath, 0, 0, (that.data.deviceWidth / 750) * 600, (that.data.deviceHeight / 1334) * 500);
    ctx.setFillStyle('white')
  
    //创建一个矩形
    ctx.fillRect(0, (that.data.deviceHeight / 1334) * 500, (that.data.deviceWidth / 750) * 600, (that.data.deviceHeight / 1334) * 350);
  
    //绘制图像到画布
    //ctx.drawImage(imgUserPath, (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 530, (that.data.deviceWidth / 750) * 120, (that.data.deviceWidth / 750) * 120)
  
    //创建文字
    ctx.setFontSize((that.data.deviceWidth / 750) * 30)
    ctx.setFillStyle('#333333')
    //文案 x y
    ctx.fillText('毕竟1米八', (that.data.deviceWidth / 750) * 170, (that.data.deviceHeight / 1334) * 590)
  
    ctx.setFontSize((that.data.deviceWidth / 750) * 25)
    ctx.setFillStyle('#666666')
    ctx.fillText('Web前端攻城狮', (that.data.deviceWidth / 750) * 170, (that.data.deviceHeight / 1334) * 630)
  
    ctx.setFontSize((that.data.deviceWidth / 750) * 22)
    ctx.setFillStyle('#999999')
    ctx.fillText('长按识别图中二维码增加好友', (that.data.deviceWidth / 750) * 30, (that.data.deviceHeight / 1334) * 710)
  
    //绘制图像到画布
    //ctx.drawImage(code, (that.data.deviceWidth / 750) * 470, (that.data.deviceHeight / 1334) * 540, (that.data.deviceWidth / 750) * 100, (that.data.deviceWidth / 750) * 100)
    //渲染
    ctx.draw(true, () => {
      that.setData({
        spinning: false
      })
    })
    // ctx.draw()
  },

  savePicutre(){
    var that = this;
    //需要把canvas转成图片后才能保存
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 600,
      height: 750,
      destWidth: 1200, //2倍关系
      destHeight: 1500, //2倍关系
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
              icon: "none",
            })
            // wx.showModal({
            //   title: '保存成功',
            //   content: '图片成功保存到相册了，去发圈噻~',
            //   showCancel: false,
            //   confirmText: '确认',
            //   confirmColor: '#21e6c1',
            //   success: function (res) {
            //     if (res.confirm) {
            //       console.log('用户点击确定');
            //     }
            //   }
            // })
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
      }
    }, this)
  },

  //保存图片 
  save: function (e) {
    this.writeCanvas();
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

})