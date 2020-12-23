const util = require("./zyy_util.js");
let app = getApp();
const board_size = 16;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    windowWidth: app.windowWidth,
    windowHeight: app.windowHeight,
    chess_size: (app.windowWidth * 0.8) / 7,
    level_flow: [5, 5, 6, 6, 7, 7],
    level_time: [5, 5, 10, 10, 15, 15],
    // level_time: [5, 5, 5, 5, 5, 1],
    level_index: 0,
    board_num: [] /* board.length = board_size */ ,
    board_img_url: [],
    chess_index: [],
    chess_move: [],
    chess_float: [] /* 左右方向上的浮动变量 */ ,
    chess_start: [],
    chess_zindex: [],
    chess_nowAt: [],
    game_state: "请记住棋盘",
    pos_table: [],
    time_limit: 30,
    time_second: 30,
    time_str: "30s",
    time_add_er: null,
    time_add_1: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initChessBoard(this, false);
    setTimeout(() => {
      gameStart(this, 'newGame');
    }, 800);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '继时性加工测试'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    util.score_to_global(app, this.data.score, this.data.level_flow.length);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.data.time_add_er);
    clearTimeout(this.data.time_add_1);
    util.score_to_global(app, this.data.score, this.data.level_flow.length);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

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
    let nowAt = util.chessAt(pos, table);
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
    let nowAt = util.chessAt(pos, this.data.pos_table);
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
  gameStart: function () {
    gameStart(this);
  },
});

/**
 * 开始游戏
 * @param {Page} that 传递进来的this
 * @param {String} newGame_or_nextLevel 是新游戏还是下一关
 */
function gameStart(that, newGame_or_nextLevel = 'newGame') {

  if (that.data.level_index >= 6) {
    gameOver(that);
    return;
  }
  if (that.data.game_state != "请记住棋盘") {
    that.setData({
      game_state: "请记住棋盘",
    });
  }
  util.initTime(that, that.data.level_time[that.data.level_index]);
  initChessBoard(that, true);
  switch (newGame_or_nextLevel) {
    case 'newGame':
      that.setData({
        level_index: 0
      })
      break;
    case 'nextLevel':
    default:
  }

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
        util.checkTime(that, () => userCommitAnswer(null, that));
      }, that.data.level_time[that.data.level_index] * 1000);
    },
  });
}

/**
 * 建立一个新的棋盘
 * @param {Page} that 传递进来的this
 * @param {Boolean} isRandom 待选棋子是否乱序
 */
function initChessBoard(that, isRandom) {
  let tar = that.data;
  tar.board_num = util.get_Random_board(tar.level_flow[tar.level_index], board_size);
  tar.board_img_url = [];
  tar.chess_move = [];
  tar.chess_start = [];
  tar.chess_nowAt = [];
  tar.chess_zindex = [];
  tar.chess_index = [];
  tar.chess_float = [];
  tar.pos_table = [];
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
  if (isRandom) {
    tar.chess_index = util.randArr(util.fillter_board(tar.board_num));
  } else {
    tar.chess_index = util.fillter_board(tar.board_num);
  }
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
    game_state: '请记住棋盘',
  });

  /* 延迟两秒后再更新棋盘位置表，避免出现错误 */
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
      that.setData({
        pos_table: pos_table
      });
    });
  }, 2000);
}

/**
 * 结束比赛
 * @param {Page} that 传递进来的this
 */
function gameOver(that) {
  wx.showToast({
    title: "游戏结束",
  });

  util.initTime(that, that.data.time_limit);
  initChessBoard(that, false);
}

function userCommitAnswer(event, that) {
  if (that.data.game_state != "开始拖动吧") {
    return;
  }
  clearTimeout(that.data.time_add_er);
  clearTimeout(that.data.time_add_1);
  let endAnswer = true;
  for (let i = 0; i < that.data.chess_index.length; i++) {
    endAnswer =
      endAnswer &&
      that.data.chess_nowAt[that.data.chess_index[i]] ==
      that.data.chess_index[i];
  }
  // console.log("测试页 用户提交答案", endAnswer);
  that.setData({
    level_index: that.data.level_index + 1
  })
  if (endAnswer) {
    that.setData({
      score: that.data.level_index
    })
    if (that.data.level_index < that.data.level_flow.length) {
      gameStart(that, "nextLevel");
    } else {
      util.score_to_global(app, that.data.score, that.data.level_flow.length);
      wx.redirectTo({
        url: '/pages/S2/successive-rules/successive-rules',
      })
    }
  } else {
    wx.showModal({
      title: "答案错误",
      content: '请前往下一个测试',
      cancelText: "再试一次",
      showCancel: false,
      confirmText: "下个测试",
      success: function (res) {
        if (res.confirm) {
          that.setData({
            score: that.data.level_index - 1
          })
          util.score_to_global(app, that.data.score, that.data.level_flow.length);
          wx.redirectTo({
            url: '/pages/S2/successive-rules/successive-rules',
          })
        } else if (res.cancel) {
          that.setData({
            level_index: 0
          });
          that.gameStart(that, "newGame");
        }
      },
      fail: function (e) {
        // console.log("fail", e);
      }
    });
  }
}