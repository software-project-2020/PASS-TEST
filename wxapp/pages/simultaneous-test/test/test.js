const app = getApp()
var testutil = require('../../../utils/testutil.js')
var util = require('../../../utils/util.js')
Page({
  data: {
    ctx: '',
    canvasWidth: 0,
    canvasHeight: 0,
    lineColor: 'black', // 颜色
    lineWidth: 3,
    currentPoint: {},
    currentLine: [], // 当前线条
    pic: '',
    now: 0,
    score: 0
  },
  onLoad: function () {
    this.initCanvas()
    testutil.getS11(0, (res) => {
      // console.log(res)
      this.setData({
        qnum: res.qnum,
        qlist: res.qlist
      })
      console.log(res.qlist)
    })
  },

  // 笔迹开始
  uploadScaleStart(e) {
    if (e.type != 'touchstart') return false;
    let ctx = this.data.ctx;
    let currentPoint = {
      x: e.touches[0].x,
      y: e.touches[0].y
    }
    let currentLine = this.data.currentLine;
    currentLine.unshift({
      x: currentPoint.x,
      y: currentPoint.y
    })
    this.setData({
      currentPoint,
    })
  },
  // 笔迹移动
  uploadScaleMove(e) {
    if (e.type != 'touchmove') return false;
    if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault();
      }
    }
    let point = {
      x: e.touches[0].x,
      y: e.touches[0].y
    }
    this.setData({
      currentPoint: point
    })
    let currentLine = this.data.currentLine
    currentLine.unshift({
      x: point.x,
      y: point.y
    })
    this.pointToLine(currentLine);
  },
  // 笔迹结束
  uploadScaleEnd(e) {
    this.setData({
      currentLine: []
    })
  },
  //画两点之间的线条；参数为:line，会绘制最近的开始的两个点；
  pointToLine(line) {
    let ctx = this.data.ctx;
    ctx.beginPath();
    ctx.setStrokeStyle(this.data.lineColor);
    ctx.setLineWidth(this.data.lineWidth);
    ctx.moveTo(line[0].x, line[0].y);
    ctx.lineTo(line[1].x, line[1].y);
    ctx.stroke();
    ctx.draw(true);
  },

  // 保存画布
  saveCanvas: function (callback) {
    wx.canvasToTempFilePath({
      canvasId: 'handWriting',
      fileType: 'jpg',
      success: res => {
        wx.showLoading({
          title: '上传中'
        })
        console.log(res.tempFilePath);
        wx.uploadFile({
          url: 'https://app.morii.top/test',
          filePath: res.tempFilePath,
          fileType: 'jpg',
          name: 'file',
          formData: {
            fileDir: 'order_apply',
            rules: JSON.stringify(this.data.qlist[this.data.now])
          },
          // success: res => {
          //   callback && callback(res)
          // },
          complete: res => {
            callback && callback(res)
            wx.hideLoading()
          }
        })
      }
    }, this)
    this.clearDraw()
  },

  // 清除画布
  clearDraw() {
    this.data.ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
    this.data.ctx.draw()
  },

  initCanvas: function () {
    let ctx = wx.createCanvasContext('handWriting')
    this.setData({
      ctx: ctx
    })
    var query = wx.createSelectorQuery();
    query.select('.handWriting').boundingClientRect(rect => {
      this.setData({
        canvasWidth: rect.width,
        canvasHeight: rect.height
      })
    }).exec();
  },
  start: function () { //练习页面点击开始测试
    this.saveCanvas((res) => {
      console.log(res)
      var text
      if (res.data == 'true')
        text = "恭喜你答对啦，你有充足的时间来完成这项测试，现在就请点击确定按钮开始吧！"
      else
        text = "做错了，不要着急，请尝试将图形画的更加规则一些，可以点击取消重新试一下。如果你准备好了，接下来你会有充足的时间来完成这项测试，现在就请点击确定按钮开始吧！"
      var that = this
      wx.showModal({
        title: '练习结束',
        content: text,
        cancelText: '再次尝试',
        confirmText: '开始测试',
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            util.initCountDown(that, 100, 1)
            that.setData({
              now: that.data.now + 1
            })
            that.clearDraw()
          }
        }
      })
    })

  },
  next: function () { //提交然后进入下一题
    this.saveCanvas((res) => {
      console.log(res)
      if (res.data == 'true') this.addscore()
      this.setData({
        now: this.data.now + 1
      })
      this.clearDraw()
    })
    

  },
  finish: function () { //提交最后一题，结算分数
    this.saveCanvas((res) => {
      console.log(res)
      if (res.data == 'true') this.addscore()
      console.log(this.data.score)
    })
    wx.navigateTo({
      url: "/pages/attention/rule1/attention",
    })
    //展示一个提示框，点击确定后进入下一项测试
  },
  addscore: function () {
    this.setData({
      score: this.data.score + 1
    })
  },
  timeout: function () {
    // submitAnswer()
  },

})