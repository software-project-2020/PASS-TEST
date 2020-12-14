module.exports = {
  userlogin: userlogin,
  personalInfo: personalInfo
}
function userlogin(userInfo){
  const d = wx.getStorageSync('userInfo')
  if(!d){
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