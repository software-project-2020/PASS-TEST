const app = getApp();
const board_size = 16;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    difficulty: 7 /* [ 5、6、7 ] */,
    board_num: [] /* board.length = board_size */,
    board_img_url: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tar = this.data;
    tar.board_num = get_Random_board(tar.difficulty,16);
    tar.board_img_url = [];
    tar.board_num.forEach((e) => {
      tar.board_img_url.push(get_num_img(e));
    });
    console.log(tar.board_num);
    console.log(tar.board_img_url);
    this.setData({
      board_num:tar.board_num,
      board_img_url:tar.board_img_url
    });
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

  get_num_img: function(num){
    get_num_img(num);
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
  return out;
}

/**
 * 打乱一个数组（原地打乱）
 * @param {Number[]} arr 需要被打乱的数组
 */
function randArr(arr) {
  for (var i = 0; i < arr.length; i++) {
    var iRand = parseInt(arr.length * Math.random());
    [arr[i],arr[iRand]]=[arr[iRand],arr[i]]
  }
}

/**
 * 得到指定数字的图片路径
 * @param {Number} num 需要图片的数字为`num`
 * @returns {String} 返回图片的路径（相对路径）
 */
function get_num_img(num) {
  console.log("get num", num);
  if (num >= 0) {
    return "../../image/zyy/" + num + ".png";
  } else {
    return "../../image/zyy/base.png";
  }
}

/**
 * 递归地整理棋盘，是棋子聚拢向中间
 * @param {Number[]} board 需要被聚拢的棋盘数组（原地聚拢）
 */
function prettyBoard(board){

  /**
   * 检查棋盘数组是否足够聚拢
   * @param {Number[]} board 被检查的棋盘数组
   * @returns {Boolean} 返回`True` or `False`
   */
  function isOK(board){
    let start=-1;
    let totalCnt=0;
    let stack=[];
    let isVisited = [];
    let step_cnt=0;

    for (let i=0;i<board.length;i++){
      if(board[i]!=-1){
        totalCnt++;
        if (start==-1){
          start=i;
        }
      }
      isVisited.push(board[i]);
    }
    stack.push(board[start]);
    do{
      let x=stack.pop();
      
    }while(step_cnt<totalCnt);

  }

  /**
   * 调整`i`号位的棋子
   * @param {Number} i 这一步想调整的棋子的索引值
   */
  function step(i){
    if([5,6,9,10].indexOf(i) > -1){

    }
  }
  
  for(let i=0;i<board.length;i++){
    step(i);
  }
}