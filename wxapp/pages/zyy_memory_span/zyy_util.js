module.exports = {
  get_num_img: get_num_img,
  fillter_board: fillter_board,
  randArr: randArr,
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