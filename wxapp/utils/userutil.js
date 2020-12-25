module.exports = {
  userlogin: userlogin,
  personalInfo: personalInfo,
  feedbackInfo:feedbackInfo
}
function userlogin(userInfo){
    console.log(userInfo)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        
        console.log(res)
        wx.request({
          method: 'POST',
          dataType: 'json',
          url: 'https://api.zghy.xyz/api/user/login',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: res.code,
            nickname: userInfo.nickName,
            gender: userInfo.gender
          },
          success: res=> {
            if (this.userloginCallback) {
              this.userloginCallback(res)
            }
            wx.setStorageSync('userInfo', Object.assign(wx.getStorageSync('userInfo'), {
              'openid':res.data.openid
            }))
          }
        })
      }
    })
}
// 上传个人信息
function personalInfo(userdata,callback) {
  console.log(userdata)
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'https://api.zghy.xyz/api/user/info',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      openid : userdata['openid'],
      birthday :userdata['birthday'],
      gender: userdata['gender']
    },
    success: function (res) {
      console.log(JSON.parse(res.data))
      callback && callback(JSON.parse(res.data));
      // wx.setStorageSync('userInfo', res.data)
    }
  })
}
//上传反馈信息
function feedbackInfo(feedbackdata) {
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'https://app.morii.top/feedback',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      openid:feedbackdata['openid'],
      feedback_type:feedbackdata['feedback_type'],
      feedback_content:feedbackdata['feedback_content'],
      imagelist:feedbackdata['imagelist'],
      contact_info:feedbackdata['contact_info'],
    },
    success: function (res) {
      console.log(res)
    }
  })
}
