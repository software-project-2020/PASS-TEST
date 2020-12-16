module.exports = {
  getQuestions: getQuestions,
  getconfiguration: getconfiguration,
  getS12: getS12,
  getS11: getS11,
  submitResult: submitResult,
  getrecordInfo: getrecordInfo
}
// 获得题目数据
function getQuestions(testId, category, num, callback) {
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'https://api.zghy.xyz/api/test/detail',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      test_id: testId,
      category: category,
      num: num
    },
    success: function (res) {
      // console.log(res.data)
      callback && callback(JSON.parse(res.data))
    }
  })
}
// 获得题目相关参数
function getconfiguration(age_group, test_id, callback) {
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'https://api.zghy.xyz/api/test/configuration',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      age_group: age_group,
      test_id: test_id,
    },
    success: function (res) {
      callback && callback(JSON.parse(res.data).data);
    }
  })
}

//获得S12题目
function getS12(ageGroup, callback) {
  var qnumlist = []
  getconfiguration(ageGroup, 'S12', (res) => {

    for (var i = 0; i < res.length; i++) {
      var temp = JSON.parse(res[i].parameter_info)
      console.log(temp)
      qnumlist[i] = temp.num
    }
    var allnum = 0
    var alllist = []
    var qnum, qlist
    getQuestions('S12', 0, qnumlist[0], (res) => {
      console.log(res)
      qnum = res.data.length
      qlist = res.data
      alllist = alllist.concat(qlist)
      allnum = allnum + qnum
      getQuestions('S12', 1, qnumlist[1], (res) => {
        qnum = res.data.length
        qlist = res.data
        alllist = alllist.concat(qlist)
        allnum = allnum + qnum
        getQuestions('S12', 2, qnumlist[2], (res) => {
          qnum = res.data.length
          qlist = res.data
          alllist = alllist.concat(qlist)
          allnum = allnum + qnum
          getQuestions('S12', 3, qnumlist[3], (res) => {
            qnum = res.data.length
            qlist = res.data
            alllist = alllist.concat(qlist)
            allnum = allnum + qnum
            getQuestions('S12', 4, qnumlist[4], (res) => {
              qnum = res.data.length
              qlist = res.data
              alllist = alllist.concat(qlist)
              allnum = allnum + qnum
              for (var j = 0; j < allnum; j++) {
                alllist[j] = JSON.parse(alllist[j])
              }
              var res = {
                'qnum': allnum,
                'qlist': alllist
              }
              callback && callback(res)
            })
          })
        })
      })
    })
  })
}
//获得S11题目
function getS11(ageGroup, callback) {
  var qnumlist = []
  var diffitylist
  if (ageGroup == 0)
    diffitylist = [0, 1, 2, 3]
  else
    diffitylist = [1, 2, 3, 4]
  getconfiguration(ageGroup, 'S11', (res) => {
    console.log(res)
    for (var i = 0; i < res.length; i++) {
      var temp = JSON.parse(res[i].parameter_info)
      console.log(temp)
      qnumlist[i] = temp.num
    }
    console.log(qnumlist)
    var allnum = 0
    var alllist = []
    var qnum, qlist
    getQuestions('S11', diffitylist[0], qnumlist[0], (res) => {
      console.log(res)
      qnum = res.data.length
      qlist = res.data
      alllist = alllist.concat(qlist)
      allnum = allnum + qnum
      getQuestions('S11', diffitylist[1], qnumlist[1], (res) => {
        qnum = res.data.length
        qlist = res.data
        alllist = alllist.concat(qlist)
        allnum = allnum + qnum
        getQuestions('S11', diffitylist[2], qnumlist[2], (res) => {
          qnum = res.data.length
          qlist = res.data
          alllist = alllist.concat(qlist)
          allnum = allnum + qnum
          getQuestions('S11', diffitylist[1], qnumlist[3], (res) => {
            qnum = res.data.length
            qlist = res.data
            alllist = alllist.concat(qlist)
            allnum = allnum + qnum
            for (var j = 0; j < allnum; j++) {
              alllist[j] = JSON.parse(alllist[j])
            }
            var res = {
              'qnum': allnum,
              'qlist': alllist
            }
            callback && callback(res)
          })
        })
      })
    })
  })
}
// 在生成结果页面的onload上传分数到服务器
function submitResult(userid, score, costtime, age, callback) {
  var avg_score = (score[0] + score[1] + score[2] + score[3]) / 4
  score[4] = avg_score
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'https://api.zghy.xyz/api/test/submit',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      openid: userid,
      age: age,
      score: JSON.stringify(score),
      cost_time: costtime
    },
    success: function (res) {
      callback && callback(JSON.parse(res.data).data);
    }
  })
}
// 获得排行榜
function getRanklist(listnum, score, costtime, callback) {
  var avg_score = (score[0] + score[1] + score[2] + score[3]) / 4
  score[4] = avg_score
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'xxxxx',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      user_id: userid,
      score: score,
      cost_time: costtime
    },
    success: function (res) {
      callback && callback(JSON.parse(res.data).data);
    }
  })
}
//上传历史测试年月
function getrecordInfo(recorddata, callback) {
  wx.request({
    method: 'POST',
    dataType: 'json',
    url: 'https://api.zghy.xyz/api/test/testhistory',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      openid:recorddata['openid'],
      testyear:recorddata['testyear'],
      testmonth:recorddata['testmonth']
    },
    success: function (res) {
      console.log(res)
      callback && callback(res);
    }
  })
}