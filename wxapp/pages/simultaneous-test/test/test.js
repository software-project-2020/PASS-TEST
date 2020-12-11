const app = getApp()
Page({
  data: {
    ctx: '',
    canvasWidth: 0,
    canvasHeight: 0,
    lineColor: 'black', // 颜色
    lineWidth: 3,
    currentPoint: {},
    currentLine: [],  // 当前线条
    pic: '',
    now:0,
    qnum:3
  },
  onLoad: function () {
    this.initCanvas()
    // util.initCountDown(this,30,1)
    
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
  saveCanvas: function () {
    //生成图片
    // const appId = wx.getStorageSync("appId");
    wx.canvasToTempFilePath({
      canvasId: 'handWriting',
      fileType: 'jpg',
      success: res => {
        wx.showLoading({
          title: '上传中'
        })
        console.log(res.tempFilePath);
        wx.uploadFile({
          url: 'http://localhost:5000/test' ,
          filePath: res.tempFilePath,
          fileType: 'jpg',
          name: 'file',
          formData: {
            fileDir: 'order_apply',
          },
          success: res => {
            console.log(res)
            // const result = JSON.parse(res.data);
            // if (result.errorCode === 0) {
            //   this.setData({
            //     pic: result.file,
            //   })
            // }
          },
          complete: res => {
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
})
