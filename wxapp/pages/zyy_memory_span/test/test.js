// pages/zyy_memory_span/test/test.js
const app = getApp();
const board_size = 16;
Page({
  /**
   * 页面的初始数据
   */
  onLoad: function () {
    initChessBoard(this, true);
  },
  data: {
    chess_size: 40,
    level_flow: [5],
    level_time: [5],
    level_index: 0,
    board_num: [] /* board.length = board_size */,
    board_img_url: [],
    chess_index: [],
    chess_move: [],
    chess_float: [] /* 左右方向上的浮动变量 */,
    chess_start: [],
    chess_zindex: [],
    chess_nowAt: [],
    game_state: "等待中" /* 练习中 等待中 游戏中 游戏结束 */,
    pos_table: [
      {
        left: 70,
        top: 78,
      },
      {
        left: 131,
        top: 78,
      },
      {
        left: 190,
        top: 78,
      },
      {
        left: 250,
        top: 78,
      },
      {
        left: 70,
        top: 138,
      },
      {
        left: 131,
        top: 138,
      },
      {
        left: 190,
        top: 138,
      },
      {
        left: 250,
        top: 138,
      },
      {
        left: 70,
        top: 197,
      },
      {
        left: 131,
        top: 197,
      },
      {
        left: 190,
        top: 197,
      },
      {
        left: 250,
        top: 197,
      },
      {
        left: 70,
        top: 257,
      },
      {
        left: 131,
        top: 257,
      },
      {
        left: 190,
        top: 257,
      },
      {
        left: 250,
        top: 257,
      },
    ],
    time_limit: 30,
    time_second: 30,
    time_str: "30秒",
    time_add_er: null,
  },

  get_num_img: function (num) {
    get_num_img(num);
  },
  moveStart: function (event) {
    if (this.data.game_state != "游戏中") {
      return;
    }
    let who = event.currentTarget.dataset.who;
    let chess_start = this.data.chess_start;
    let param = {};
    if (chess_start[who].left == 0 && chess_start[who].top == 0) {
      param["chess_start[" + who + "]"] = {
        left: event.currentTarget.offsetLeft + this.data.chess_size / 2,
        top: event.currentTarget.offsetTop - this.data.chess_size / 4,
      };
    }
    param["chess_zindex[" + who + "]"] = 200;
    this.setData(param);
    // console.log(event.changedTouches[0].pageX);
    // console.log(param);
    // console.log("触摸开始 who",who);
    // console.log("触摸开始 chess_start",chess_start);
  },
  handleMove: function (event) {
    if (this.data.game_state != "游戏中") {
      return;
    }
    let who = event.currentTarget.dataset.who;
    let start = this.data.chess_start[who];
    let table = this.data.pos_table;
    let pos = {
      left: event.changedTouches[0].pageX,
      top: event.changedTouches[0].pageY,
    };
    let nowAt = chessAt(pos, table);
    let move = {};
    if (nowAt >= 0) {
      move = {
        left: table[nowAt].left - start["left"],
        top: table[nowAt].top - start["top"],
      };
    } else {
      move = {
        left: event.changedTouches[0].pageX - start["left"],
        top: event.changedTouches[0].pageY - start["top"],
      };
    }

    let param = {};
    param["chess_move[" + who + "]"] = move;
    this.setData(param);
  },
  moveEnd: function (event) {
    if (this.data.game_state != "游戏中") {
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
    let endAnswer = true;
    for (let i = 0; i < this.data.chess_index.length; i++) {
      endAnswer =
        endAnswer &&
        this.data.chess_nowAt[this.data.chess_index[i]] ==
          this.data.chess_index[i];
    }
    let that = this;
    if (endAnswer) {
      wx.showToast({
        title: getScore(that),
        duration: 1000,
        icon: "succes",
        mask: true,
      });
    }
    console.log("触摸结束", who, nowAt, this.data.board_num[who], pos);
  },
  gameStart: function () {
    gameStart(this);
  },
  gameReStart: function () {
    gameReStart(this);
  },
});

/**
 * 得到指定数字的图片路径
 * @param {Number} num 需要图片的数字为`num`
 * @returns {String} 返回图片的路径（相对路径）
 */
function get_num_img(num) {
  // console.log("get num", num);
  if (num >= 0) {
    return "https://picture.morii.top/renzhixuetang/zyy/" + num + ".png";
  } else {
    return "https://picture.morii.top/renzhixuetang/zyy/base.png";
  }
}

/**
 * 返回一个过滤了数组中全部的-1的新数组，数组元素是索引值
 * @param {Number[]} board 待过滤的棋盘数组
 */
function fillter_board(board) {
  let out = [];
  board.forEach((e, i) => {
    if (e != -1) {
      out.push(i);
    }
  });
  return out;
}

/**
 * 开始游戏
 * @param {Page} that 传递进来的this
 */
function gameStart(that) {
  if (that.data.level_index >= 1) {
    testOver(that);
    initTime(that, that.data.time_limit);
    initChessBoard(that, false);
    return;
  }
  if (that.data.game_state != "等待中") {
    that.setData({
      game_state: "等待中",
    });
  }
  initTime(that, that.data.time_limit);
  initChessBoard(that, true);
  wx.showToast({
    title: "请记住棋盘",
    icon: "succes",
    duration: 1000,
    complete: () => {
      setTimeout(() => {
        checkTime(that);
        that.setData({
          game_state: "游戏中",
          // time_begin: new Date()
        });
      }, that.data.level_time[that.data.level_index] * 1000 + 1000);
    },
  });
}

function checkTime(that) {
  if (that.data.time_add_er != null) {
    clearTimeout(that.data.time_add_er);
  }
  that.data.time_add_er = setTimeout(function () {
    let sec = that.data.time_second - 1;
    if (sec >= 0) {
      let str = sec + "秒";
      that.setData({
        time_second: sec,
        time_str: str,
      });
      checkTime(that);
    } else {
      wx.showToast({
        title: "时间到",
        duration: 1000,
        icon: "succes",
        mask: true,
      });
      setTimeout(() => {
        wx.showToast({
          title: "Game Over",
          duration: 1000,
          icon: "succes",
          mask: true,
        });
        setTimeout(() => {
          testOver(that);
        }, 1000);
      }, 1000);
    }
  }, 1000);
}

/**
 * 初始化时间设置
 * @param {Page} that 传递进来的this
 * @param {Number} time_limit_in_second 倒计时 单位`秒`
 */
function initTime(that, time_limit_in_second) {
  if (that.data.time_add_er != null) {
    clearTimeout(that.data.time_add_er);
  }
  that.setData({
    time_second: time_limit_in_second,
    time_str: time_limit_in_second + "秒",
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
    tar.board_img_url.push(get_num_img(e));
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
  tar.chess_index = fillter_board(tar.board_num);
  // console.log(tar.board_num);
  // console.log(tar.board_img_url);
  console.log(tar.chess_index);
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
/**
 * 计算得分
 * @param {Page} that 传递进来的this
 * @returns {String} 第 ? 关成功
 */
function getScore(that) {
  clearTimeout(that.data.time_add_er);
  let tar = that.data;
  tar.level_index += 1;
  that.setData({
    game_state: "游戏结束",
    level_index: tar.level_index,
  });
  wx.showModal({
    title: "正式测试即将开始",
    content: "恭喜你～ 成功通过了练习，现在要开始测试么？",
    cancelText: "再练一遍",
    confirmText: "开始测试",
    success: function (res) {
      if (res.confirm) {
        //这里是点击了确定以后
        wx.navigateTo({
          url: "/pages/zyy_memory_span/memory_span",
        });
      } else {
        wx.navigateBack({
          delta: 0,
        });
      }
    },
  });
}

/**
 * 结束比赛
 * @param {Page} that 传递进来的this
 */
function testOver(that) {
  wx.showModal({
    title: "超时",
    content: "很可惜～ 练习已经超时了",
    cancelText: "我再看看",
    confirmText: "再练一遍",
    success: function (res) {
      if (res.confirm) {
        wx.navigateBack({
          delta: 0,
        });
      }
    },
  });
}
