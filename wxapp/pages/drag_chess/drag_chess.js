// pages/drag_chess/drag_chess.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    /* 约束可拖动的最大范围 X:84% Y:89% */
    win_limit: [84, 89],
    /* X Y 定位 */
    writesize: [0, 0],
    /* 屏幕尺寸 */
    window: [0, 0],
    /* 定位参数 */
    write: [0, 0],
    /* 据顶部距离 */
    scrolltop: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})