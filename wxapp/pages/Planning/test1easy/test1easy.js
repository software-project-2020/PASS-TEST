Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '',//定时器名字
    countDownNum: '60',//倒计时初始值
    nowcount:0,
    count:0,
    nowdifficulty:6,
    l: [],
    list:{0:"../../../image/lyq/number/0.png",1:"../../../image/lyq/number/1.png",2:"../../../image/lyq/number/2.png",
    3:"../../../image/lyq/number/3.png",4:"../../../image/lyq/number/4.png",5:"../../../image/lyq/number/5.png",
    6:"../../../image/lyq/number/6.png",7:"../../../image/lyq/number/7.png",8:"../../../image/lyq/number/8.png",9:"../../../image/lyq/number/9.png",
  },
   num:[],
   bg:[],
   flag:[],  
   isPass:false,
   isFaild:false,
  },

  sum(){
    let nowcount=this.data.nowcount;
    let count = this.data.count;
    let isPass=this.data.isPass;
    let isFaild=this.data.isFaild;
    var i=0;
    let num = this.data.num;
    if(nowcount==count&&this.data.isPass==false&&this.data.isFaild==false){
      clearInterval(this.data.timer);
      this.timer = null;
      this.time = 0;
      this.setData({
        isPass:true,
        isFaild:false
      })
      // console.log(this.data.isPass)
      wx.showModal({
        title: '恭喜',
        content: '完成测试',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
            // wx.navigateTo({
            //   url: '',
            //   })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.initnum(this.data.nowdifficulty)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  initnum(size){
    var nowdifficulty=this.data.nowdifficulty;
    this.setData({
      nowdifficulty:size
    })
    var bg = this.data.bg;
    var num = this.data.num;
    var flag = this.data.flag;
    for(var i=0;i<this.data.nowdifficulty*this.data.nowdifficulty;i++){
        bg.push(true);
        num.push("0");
        flag.push(0);
      }
      // console.log(bg)
      // console.log(num)
      this.setData({
        bg:bg,
        num:num,
        flag:flag
      })
    var i=0,j=0,a;
    var l= this.data.l;
    for(i=0;i<this.data.nowdifficulty;i++){
      l.push([])
      for(j=0;j<this.data.nowdifficulty;j++){
        a=Math.floor(Math.random()*10);
        var item={
          "index":i*this.data.nowdifficulty+j,
          "value":a,
          "add":this.data.list[a]
        }
        l[i].push(item)
      }
      }
      this.setData({
        l:l
      })
      console.log(l)
  },
  onReady: function () {
    this.picesCode()
    this.choicenum()
  },

  picesCode: function (e) {
    var that = this;
      var choosepic = Math.floor(Math.random() * 10 ); 
      var choosepic1 = Math.floor(Math.random() * 10 ); 
      while(choosepic==choosepic1)
        choosepic1 = Math.floor(Math.random() * 10 );
      that.setData({
        choosepic:choosepic,
        choosepic1:choosepic1
    })
  },

  choicenum:function(e){
    var that = this;
    let choosepic = this.data.choosepic;
    let choosepic1 = this.data.choosepic1;
    let count = this.data.count;
    let l = this.data.l;
    var i = 0;
    for(i=0;i<this.data.nowdifficulty*this.data.nowdifficulty;i++){
      let index="num["+i+"]";
      var value=l[Math.floor(i/this.data.nowdifficulty)][i%this.data.nowdifficulty].value;
      that.setData({
        [index]:value,
      });
    }
    // console.log(l)
    // console.log(this.data.num)
    for(i=0;i<this.data.nowdifficulty*this.data.nowdifficulty;i++){
      if(Number(this.data.num[i])==Number(choosepic)||Number(this.data.num[i])==Number(choosepic1)){
        that.setData({
          count:this.data.count+1,
        });
      }
    }
    // console.log(this.data.count)
  },
  change: function(e){
    var that = this;  
    let num = this.data.num;
    let flag = this.data.flag;
    let choosepic = this.data.choosepic;
    let choosepic1 = this.data.choosepic1;
    let nowcount = this.data.nowcount;
    // console.log(this.data.isFaild)
    if(this.data.isPass==false&&this.data.isFaild==false){
      var i =0;
      // console.log(e.target.dataset.name)
      i=Number(e.target.dataset.name)
      let index="bg["+i+"]";
      let indexflag="flag["+i+"]";
      var value= !(this.data.num[i]==this.data.choosepic||num[i]==this.data.choosepic1)
      // console.log(this.data.num[i])
      // console.log(Number(!value))
      if(this.data.flag[i]<=1){//如果flag[i]是2，说明已经圈过，nowcount不能再加了
        that.setData({
        [index]: value,
        [indexflag]:[indexflag]+Number(!value),
        nowcount:nowcount+Number(!value),
    })
  }
  // console.log(this.data.now)
    this.sum();
    }
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.isPass==false&&this.data.isFaild==false)
      this.countDown();
  },
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    let isFaild=this.data.isFaild;
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          this.timer = null;
          this.time = 0;
          that.setData({
            isFaild:true
          }),
          wx.showModal({
            title: '糟糕',
            content: '时间花光了',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {//这里是点击了确定以后
                console.log('点击确定')
                // wx.navigateTo({
                //   url: '',
                //   })
              }
            }
          })
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})