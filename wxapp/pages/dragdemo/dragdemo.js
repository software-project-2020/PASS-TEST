const app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    chess_s:[1, 3, 4, 7, 6 ],
    /* 约束可拖动的最大范围 X:84% Y:89% */
    win_limit: [20, 20],
    /* X Y 定位 */
    writesize: [0, 0],
    /* 屏幕尺寸 */
    window: [0, 0],
    /* 定位参数 */
    write: [0, 0],
    /* 距顶部距离 */
    scrolltop: 0,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 在页面中定义插屏广告
    let that = this;
    that.getSysdata();
  },
  //计算默认定位值
  getSysdata: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (e) {
        that.data.window = [e.windowWidth, e.windowHeight];
        var write = [];
        write[0] = that.data.window[0] * that.data.win_limit[0] / 100;
        write[1] = that.data.window[1] * that.data.win_limit[1] / 100;
        console.log(write,45)
        that.setData({
          write: write
        }, function () {
          // 获取元素宽高
          wx.createSelectorQuery().select('.collectBox').boundingClientRect(function (res) {
            console.log(res.width)
            that.data.writesize = [res.width, res.height];
          }).exec();
        })
      },
      fail: function (e) { 
        console.log(e)
      }
    });
  },
  //开始拖拽  
  touchmove: function (e) {
    var that = this;
    console.log(e);
    var position = [e.touches[0].pageX - that.data.writesize[0] / 2, e.touches[0].pageY - that.data.writesize[1] / 2 - that.data.scrolltop];
    that.setData({
      write: position
    });
  },
  onPageScroll(e) {
    this.data.scrolltop = e.scrollTop;
  },
  get_num_img: function (num) {
    get_num_img(num);
  }
})
/**                                                                        
 * 得到指定数字的图片路径                                                                        
 * @param {Number} num 需要图片的数字为`num`                                                                        
 * @returns {String} 返回图片的路径（相对路径）                                                                        
 */
function get_num_img(num) {
  // console.log("get num", num);
  if (num >= 0) {
    return "../../image/zyy/" + num + ".png";
  } else {
    return "../../image/zyy/base.png";
  }
}