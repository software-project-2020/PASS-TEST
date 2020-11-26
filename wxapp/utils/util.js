module.exports = {
  formatTime: formatTime,
  initCountDown: initCountDown,
  closeCountDown:closeCountDown
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// function countDown(page) {
//   let that = page;
//   let countDownNum = that.data.countDownNum; //获取倒计时初始值
//   //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
//   that.setData({
//     timer: setInterval(function () { //这里把setInterval赋值给变量名为timer的变量
//       //每隔一秒countDownNum就减一，实现同步
//       countDownNum--;
//       //然后把countDownNum存进data，好让用户知道时间在倒计着
//       that.setData({
//         countDownNum: countDownNum
//       })
//       //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
//       if (countDownNum == 0) {
//         //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
//         //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
//         clearInterval(that.data.timer);
//         page.timer = null;
//         page.time = 0;
//         that.setData({
//           isFaild: true
//         })
//         //关闭定时器之后，可作其他处理codes go here
//         wx.showModal({
//           title: '糟糕',
//           content: '时间花光了',
//           showCancel: false,
//           success: function (res) {
//             if (res.confirm) { //这里是点击了确定以后
//               console.log('点击确定')
//               // wx.navigateTo({
//               //   url: '',
//               //   })
//             }
//           }
//         })
//       }
//     }, 1000)
//   })
// }
/**
  page :当前页面this 
  countDownNum :需要设置倒计时的时间(s)
  注意：需要在自己的页面中定义timeout()用于执行时间到了的操作
*/
function initCountDown(page,countDownNum,interval) { 
  let that = page;
  let displayTime=countDownNum
  that.setData({
    countDownNum:countDownNum,
    displayTime:countDownNum
  })
  // console.log(that.data.displayTime)
  //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
  that.setData({
    timer: setInterval(function () { //这里把setInterval赋值给变量名为timer的变量
      //每隔一秒countDownNum就减一，实现同步
      // console.log(displayTime)
      countDownNum=(countDownNum-interval).toFixed(1)
      displayTime=Math.ceil(countDownNum)
      //然后把countDownNum存进data，好让用户知道时间在倒计着
      that.setData({
        countDownNum: countDownNum,
        displayTime:displayTime
      })
      //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
      if(page.data.countDownNum == 0){
        closeCountDown(page)
        page.timeout()
      }
    }, 1000*interval)
  })
  
}
//关闭计时器，时间到时自动执行，在用户提交答案需要自行调用提前关闭计时器
function closeCountDown(page) {
  let that = page;
  clearInterval(that.data.timer);
  page.timer = null;
  page.time = 0;
}