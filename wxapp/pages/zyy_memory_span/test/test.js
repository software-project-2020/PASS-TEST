// pages/zyy_memory_span/test/test.js
const util = require("../zyy_util")
const app = getApp();
const board_size = 16;
Page({
  onLoad: function () {
    initChessBoard(this, true);
    setTimeout(() => {
      gameStart(this);
    }, 500);
  },
  /* 离开时一定要删除计时器 */
  onUnload: function () {
    clearTimeout(this.data.time_add_er);
    clearTimeout(that.data.time_add_1);
  },
  /* 延迟两秒后再更新棋盘位置表，避免出现错误 */
  onReady: function () {
    setTimeout(() => {
      let query = wx.createSelectorQuery();
      query.selectAll('.chess_map > .chess_box').boundingClientRect();
      query.exec((res) => {
        let pos_table = [];
        res[0].forEach((e) => {
          pos_table[parseInt(e.id)] = {
            // left: e.left,
            // right: e.right,
            // top: e.top,
            // bottom: e.bottom,
            // centerX: (e.left + e.right) / 2,
            // centerY: (e.top + e.bottom) / 2,
            left: (e.left + e.right) / 2,
            top: (e.top + e.bottom) / 2,
          }
        });
        // console.log(pos_table);
        this.setData({
          pos_table: pos_table
        });
      });
    }, 2000);
  },
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.windowWidth,
    windowHeight: app.windowHeight,
    chess_size: (app.windowWidth * 0.8) / 7,
    level_flow: [5],
    level_time: [5],
    level_index: 0,
    board_num: [] /* board.length = board_size */ ,
    board_img_url: [],
    chess_index: [],
    chess_move: [],
    chess_float: [] /* 左右方向上的浮动变量 */ ,
    chess_start: [],
    chess_zindex: [],
    chess_nowAt: [],
    game_state: "等待中" /* 练习中 等待中 开始拖动吧 游戏结束 */ ,
    pos_table: [],
    time_limit: 30,
    time_second: 30,
    time_str: "30s",
    time_add_1: null,
    time_add_2: null,
    time_add_er: null,
  },
  /* 映射数字到图片路径 */
  get_num_img: function (num) {
    util.get_num_img(num);
  },
  /**
   * 处理 触摸开始
   * @todo 初始化棋子的初始位置
   * @todo 被拖动的棋子 z-index 调高至200
   */
  moveStart: function (event) {
    if (this.data.game_state != "开始拖动吧") {
      return;
    }
    let who = event.currentTarget.dataset.who;
    let chess_start = this.data.chess_start;
    let param = {};
    if (chess_start[who].left == 0 && chess_start[who].top == 0) {
      param["chess_start[" + who + "]"] = {
        left: event.currentTarget.offsetLeft + this.data.chess_size / 2,
        top: event.currentTarget.offsetTop,
      };
    }
    param["chess_zindex[" + who + "]"] = 200;
    this.setData(param);
    // console.log(event.changedTouches[0].pageX);
    // console.log(param);
    // console.log("触摸开始 who",who);
    // console.log("触摸开始 chess_start",chess_start);
  },
  /**
   * 处理 正在拖动中
   * @todo 棋子位置挪动到触摸位置或者自动吸位
   */
  handleMove: function (event) {
    if (this.data.game_state != "开始拖动吧") {
      return;
    }
    let who = event.currentTarget.dataset.who;
    let start = this.data.chess_start[who];
    let table = this.data.pos_table;
    let pos = {
      left: event.changedTouches[0].pageX,
      top: event.changedTouches[0].pageY,
    };
    let move = {};
    let nowAt = chessAt(pos, table);
    if (nowAt >= 0) {
      move = {
        left: table[nowAt].left - start["left"],
        top: table[nowAt].top - start["top"],
      };
    } else {
      move = {
        left: pos.left - start.left,
        top: pos.top - start.top,
      };
    }

    let param = {};
    param["chess_move[" + who + "]"] = move;
    this.setData(param);
  },
  /**
   * 处理 触摸结束
   * @todo 获取当前棋子，获取当前棋子的坐标
   * @todo 获取并保存当前棋子所在格子的索引信息
   * @todo 如果格子索引是-1，则，棋子位移归置为0，棋子返回待选区
   * @todo 被拖动的棋子 z-index 调回至100
   */
  moveEnd: function (event) {
    if (this.data.game_state != "开始拖动吧") {
      return;
    }
    let who = event.currentTarget.dataset.who;
    let pos = {
      left: event.changedTouches[0].pageX,
      top: event.changedTouches[0].pageY,
    };
    let nowAt = chessAt(pos, this.data.pos_table);
    let move = {};
    let param = {};

    /* 检查当前棋子所在位置的索引 */
    if (nowAt < 0 || nowAt >= board_size) {
      // console.log("back");
      move = {
        left: 0,
        top: 0,
      };
      param["chess_move[" + who + "]"] = move;
    }

    param["chess_nowAt[" + who + "]"] = nowAt;
    param["chess_zindex[" + who + "]"] = 100;
    this.setData(param);
    // console.log("触摸结束", who, nowAt, this.data.board_num[who], pos);
  },
  /** 
   * 用户提交答案
   */
  userCommitAnswer: function (event) {
    userCommitAnswer(event, this);
  },
  /**
   * 跳过练习，前往测试页
   * @todo 删除本页的计时器
   */
  skip_练习: function () {
    clearTimeout(this.data.time_add_er);
    clearTimeout(this.time_add_1);
    this.data.time_add_er = null;
    // console.log("zyy_test 计时器移除", this.data.time_add_er);
    wx.navigateTo({
      url: '/pages/zyy_memory_span/memory_span',
    })
  }
});

/**
 * 开始游戏
 * @param {Page} that 传递进来的this
 */
function gameStart(that) {
  clearTimeout(that.data.time_add_er);
  if (that.data.game_state != "等待中") {
    that.setData({
      game_state: "等待中",
    });
  }
  util.initTime(that, that.data.level_time[that.data.level_index]);
  initChessBoard(that, true);
  wx.showToast({
    title: "请记住棋盘",
    icon: "succes",
    duration: 1000,
    complete: () => {
      util.checkTime(that);
      that.data.time_add_1 = setTimeout(() => {
        util.initTime(that, 30);
        that.setData({
          game_state: "开始拖动吧"
        });
        util.checkTime(that, (e) => {
          // console.log(e);
        }, {
          msg: "做题时间计时器被触发"
        });
      }, that.data.level_time[that.data.level_index] * 1000 + 1000);
    },
  });
}

/**
 * 返回当前棋子位置所在的索引值
 * @param {JSON}  pos 带检测棋子的位置
 * @param {JSON[]} table 存有棋子坐标的一维数组
 * @returns {Number} `where` `[0,15] | -1`
 */
function chessAt(pos, table) {
  function comp(pos, tar) {
    return pos > tar - 30 && pos < tar + 30;
  }
  let where = -1;
  for (let i = 0; i < table.length; i++) {
    if (comp(pos.left, table[i].left) && comp(pos.top, table[i].top)) {
      where = i;
      break;
    }
  }
  return where;
}

/**
 * 建立一个新的棋盘
 * @param {Page} that 传递进来的this
 * @param {Boolean} mode 待选棋子是否乱序
 */
function initChessBoard(that, mode) {
  let tar = that.data;
  tar.board_num = [-1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 3, 2, -1, -1, -1, -1];
  tar.board_img_url = [];
  tar.chess_move = [];
  tar.chess_start = [];
  tar.chess_nowAt = [];
  tar.chess_zindex = [];
  tar.chess_index = [];
  tar.chess_float = [];
  tar.board_num.forEach((e) => {
    tar.board_img_url.push(util.get_num_img(e));
    tar.chess_move.push({
      left: 0,
      top: 0,
    });
    tar.chess_start.push({
      left: 0,
      top: 0,
    });
    tar.chess_nowAt.push(-1);
    tar.chess_zindex.push(100);
    tar.chess_float.push(0);
  });
  tar.chess_index = util.fillter_board(tar.board_num);
  // console.log(tar.board_num);
  // console.log(tar.board_img_url);
  // console.log(tar.chess_index);
  // console.log(tar.chess_move);
  that.setData({
    board_num: tar.board_num,
    board_img_url: tar.board_img_url,
    chess_index: tar.chess_index,
    chess_move: tar.chess_move,
    chess_zindex: tar.chess_zindex,
    chess_nowAt: tar.chess_nowAt,
    chess_float: tar.chess_float,
  });
}

function userCommitAnswer(event, that) {
  clearTimeout(that.data.time_add_er);
  clearTimeout(that.data.time_add_1);
  let endAnswer = true;
  for (let i = 0; i < that.data.chess_index.length; i++) {
    endAnswer =
      endAnswer &&
      that.data.chess_nowAt[that.data.chess_index[i]] ==
      that.data.chess_index[i];
  }
  if (endAnswer) {
    wx.showModal({
      title: "正式测试即将开始",
      content: "恭喜你～ 成功通过了练习，现在要开始测试么？",
      cancelText: "再练一遍",
      confirmText: "去测试",
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: "/pages/zyy_memory_span/memory_span",
          });
        } else {
          gameStart(that);
        }
      },
    });
  } else {
    wx.showModal({
      title: "答案错误",
      content: "很可惜，练习未成功，确定要直接开始测试么？",
      cancelText: "再练一遍",
      confirmText: "去测试",
      success: function (res) {
        if (res.confirm) {
          //这里是点击了确定以后
          wx.navigateTo({
            url: "/pages/zyy_memory_span/memory_span",
          });
        } else {
          gameStart(that);
        }
      },
    });
  }
}