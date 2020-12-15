const app = getApp();
const board_size = 16;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chess_size: 40,
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
    game_state: "等待中" /* 练习中 等待中 游戏中 游戏结束 */ ,
    pos_table: [],
    time_limit: 30,
    time_second: 30,
    time_str: "30秒",
    // time_begin: null /* new Date() */ ,
    time_add_er: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initChessBoard(this, false);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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

  get_num_img: function (num) {
    get_num_img(num);
  },
  moveStart: function (event) {
    // if (this.data.game_state != "游戏中") {
    // return;
    // }
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
  },
  handleMove: function (event) {
    // if (this.data.game_state != "游戏中") {
    // return;
    // }
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
      console.log("now at ", nowAt);
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
    // console.log("tar_float",who,tar_float);
    // console.log("event",event);
    // console.log("event..pageX-(...): ", event.changedTouches[0].pageX - this.data.chess_start[who].left);
    // console.log(param["chess_move[" + who + "]"].left, param["chess_float[" + who + "]"]);
  },
  moveEnd: function (event) {
    // if (this.data.game_state != "游戏中") {
    // return;
    // }
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
    if (endAnswer && that.data.game_state == "游戏中") {
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
  domTest: function (event) {
    domTest(event);
  }
});

/**
 * 建立随机的初始棋盘
 * @param {Number} n 有 n 个有效的格子
 * @param {Number} size 总共有 size 个格子
 * @returns {Number[]} 包含`n`个不同的正整数和`size-n`个`-1`的一维数组
 */
function get_Random_board(n, size) {
  let base = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  randArr(base);
  let out = base.slice(0, n);
  for (let i = n; i < size; i++) {
    out.push(-1);
  }
  randArr(out);
  prettyBoard(out);
  return out;
}

/**
 * 打乱一个数组（原地打乱）
 * @param {Number[]} arr 需要被打乱的数组
 */
function randArr(arr) {
  for (var i = 0; i < arr.length; i++) {
    var iRand = parseInt(arr.length * Math.random());
    [arr[i], arr[iRand]] = [arr[iRand], arr[i]];
  }
  return arr;
}

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
 * 整理棋盘，使棋子聚拢向中间
 * @param {Number[]} board 需要被聚拢的棋盘数组（原地聚拢）
 */
function prettyBoard(board) {
  /**
   * 检查棋盘数组是否足够聚拢
   * @param {Number[]} board 被检查的棋盘数组
   * @returns {Boolean} 返回`True` or `False`
   */
  function isOK(board) {
    let start = -1;
    let totalCnt = 0;
    let stack = []; /* 预备查看的索引值 栈 */
    let isVisited = []; /* -1:无需访问 0:已经访问 >0:需要访问还未访问 */
    let step_cnt = 0;

    /* 遍历出所有合法点个数 */
    for (let i = 0; i < board.length; i++) {
      if (board[i] != -1) {
        totalCnt++;
        /* 保存第一个合法点的下标 */
        if (start == -1) {
          start = i;
        }
      }
      isVisited.push(board[i]);
    }
    stack.push(start);
    do {
      let x = stack.pop(); /* 取出并保存本次局部搜索的起点索引 */
      let tars = [
        x - 1,
        x + 1,
        x - 4,
        x + 4,
      ]; /* 本次局部搜索四个方向上的索引 */

      tars.forEach((tar) => {
        /* 如果坐标未越界 */
        if (tar >= 0 || tar < board.length) {
          /* 当前节点待遍历 */
          if (isVisited[tar] > 0) {
            isVisited[tar] = 0; /* 标记为已经遍历 */
            step_cnt++; /* 有效值计数器自增 */
            stack.push(tar); /* 当前位置标记为下一个起点 */
          } /* 否则（≤0），无需访问 */
        }
      });
    } while (stack.length > 0);
    return step_cnt == totalCnt;
  }

  /**
   * 调整`i`号位的棋子
   * @param {Number[]} 待调整的棋盘数组
   * @param {Number} i 这一步想调整的棋子的索引值
   */
  function step(board, i) {
    /* 如果 位置上没有数字 or i是在中间的那四个格子（索引分别是 5 6 9 10） */
    if (board[i] == -1 || [5, 6, 9, 10].indexOf(i) > -1) {
      /* 则什么都不做 */
      return;
    }
    /* 如果 是第1列 */
    if (i % 4 == 0) {
      /* 则 向右 挪动一格 */
      if (board[i + 1] == -1) {
        [board[i], board[i + 1]] = [board[i + 1], board[i]];
      }
    } else if (i % 4 == 3) {
      /* 如果 是第4列 */
      /* 则 向左 挪动一格 */
      if (board[i - 1] == -1) {
        [board[i], board[i - 1]] = [board[i - 1], board[i]];
      }
    } else if (i / 4 < 1) {
      /* 如果 是第1行 */
      /* 则 向下 挪动一格 */
      if (board[i + 4] == -1) {
        [board[i], board[i + 4]] = [board[i + 4], board[i]];
      }
    } else if (i / 4 >= 3) {
      /* 如果 是第4行 */
      /* 则 向上 挪动一格 */
      if (board[i - 4] == -1) {
        [board[i], board[i - 4]] = [board[i - 4], board[i]];
      }
    }
  }

  // console.log("调整前：", isOK(board));
  for (let k = 0; k < 5; k++) {
    if (!isOK(board)) {
      for (let i = 0; i < board.length; i++) {
        step(board, i);
      }
      // console.log("调整后：", isOK(board));
    } else {
      break;
    }
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
 * @param {String} newGame_or_nextLevel 是新游戏还是下一关
 */
function gameStart(that, newGame_or_nextLevel = 'newGame') {
  if (that.data.level_index >= 6) {
    gameOver(that);
    return;
  }
  if (that.data.game_state != "等待中") {
    that.setData({
      game_state: "等待中",
    });
  }
  initTime(that, that.data.time_limit);
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
          gameOver(that);
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
    console.log("compare ", pos, table[i], comp(pos.left, table[i].left) && comp(pos.top, table[i].top));
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
 * @param {Boolean} isRandom 待选棋子是否乱序
 */
function initChessBoard(that, isRandom) {
  let tar = that.data;
  tar.board_num = get_Random_board(tar.level_flow[tar.level_index], board_size);
  tar.board_img_url = [];
  tar.chess_move = [];
  tar.chess_start = [];
  tar.chess_nowAt = [];
  tar.chess_zindex = [];
  tar.chess_index = [];
  tar.chess_float = [];
  tar.pos_table = [];
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
  if (isRandom) {
    tar.chess_index = randArr(fillter_board(tar.board_num));
  } else {
    tar.chess_index = fillter_board(tar.board_num);
  }
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
    game_state: '等待中',
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
      console.log(pos_table);
      that.setData({
        pos_table: pos_table
      });
    });
  }, 2000);
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
  if (tar.level_index < 6) {
    that.setData({
      game_state: "下一轮",
      level_index: tar.level_index,
    });
    setTimeout(() => {
      gameStart(that, 'nextLevel');
    }, 1000);
  }
  return "第 " + tar.level_index + " 关成功";
}

/**
 * 结束比赛
 * @param {Page} that 传递进来的this
 */
function gameOver(that) {
  wx.showToast({
    title: "游戏结束",
  });
  initTime(that, that.data.time_limit);
  initChessBoard(that, false);
}