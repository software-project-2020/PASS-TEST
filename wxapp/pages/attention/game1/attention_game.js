// pages/attention/attention_game.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    timer: '',//定时器名字
    countDownNum: '60',//倒计时初始值
  },
  onReady: function () {
    var that=this;

    /************ 文字逐个显示 ************/
    var chars = ['0','1','2','3','4','5','6','7','8','9'];
    var story = "";
    for (var i = 0 ; i < 32 ; i ++){
      var id = parseInt(Math.random() * 10);
      story += chars[id];
    }
    var i= 1;
    var time = setInterval(function(){
        var text = story.substring(0, i);
        i++;
        that.setData({
            text: text
        });
        if (text.length == story.length) {
          //   console.log("定时器结束！");
            clearInterval(time);
        }
    },1000);
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '注意'
    })
  },
  
})