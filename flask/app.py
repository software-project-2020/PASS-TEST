from flask import Flask, request
import urllib, json
import pymysql, time

app = Flask(__name__)


# 连接数据库
def sqlconnect():
    connect = pymysql.Connect(
        host='localhost',
        port=3306,
        user='app_morii_top',
        passwd='HCy77bCNSwsDLBiW',
        db='app_morii_top',
        charset='utf8'
    )
    return connect


@app.route('/', methods=["POST"])
def hello_world():
    if request.form['userid'] == '1':
        return 'Hello World!'
    else:
        return 'bye'


# 第一次登录，访问微信服务器换取openid，并在数据库中创建用户，生成id
@app.route('/login', methods=["POST"])
def login():
    userInfo = {'id': request.form.get('id'), 'nickname': request.form.get('nickname'), 'age': None,
                'gender': request.form.get('gender'), 'flag': False, 'birthday': None}
    appid = "wxbe7e6a8c236b2b8c"
    appSecret = "881be456b991f2037fea8217908d6c9d"
    url = "https://api.weixin.qq.com/sns/jscode2session?" \
          "appid={}&secret={}&js_code={}&grant_type=authorization_code".format(appid, appSecret,
                                                                               request.form.get('code'))
    # openid:用户唯一标识 session_key:会话密钥
    res = json.loads(urllib.request.urlopen(url).read().decode('utf-8'))
    if 'errcode' not in res:
        connect = sqlconnect()
        cursor = connect.cursor()
        sql = "SELECT * FROM `user` WHERE `openid`= '{}'".format(res['openid'])
        cursor.execute(sql)
        sqlres = cursor.fetchall()
        # 首次登录
        if len(sqlres) == 0:
            nowtime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
            updatasql = "INSERT INTO `wxapp`.`user`(`openid`, `nickname`, `session_key`, `register_time`, `last_login_time`,`gender`) " \
                        "VALUES ('{}', '{}', '{}', '{}', '{}','{}')".format(res['openid'],
                                                                            request.form.get('nickname'),
                                                                            res['session_key'], nowtime, nowtime,
                                                                            userInfo['gender'])
            cursor.execute(updatasql)
            connect.commit()
            qsql = "SELECT id FROM `user` WHERE openid='{}'".format(res['openid'])
            cursor.execute(qsql)
            quaryres = cursor.fetchall()[0]
            userInfo['id'] = quaryres[0]
            userInfo['flag'] = True
        else:  # 只需要查询
            qsql = "SELECT id,nickname,gender,age,birthday FROM `user` WHERE openid = '{}'".format(res['openid'])
            cursor.execute(qsql)
            quaryres = cursor.fetchall()[0]
            userInfo['id'] = quaryres[0]
            userInfo['nickname'] = quaryres[1]
            userInfo['gender'] = quaryres[2]
            userInfo['age'] = quaryres[3]
            userInfo['birthday'] = quaryres[4]
        connect.close()
    else:
        userInfo = None
    return userInfo

# 提交用户第一次登录时设置的年龄
@app.route('/personalInfo', methods=["POST"])
def personalInfo():
    connect = sqlconnect()
    cursor = connect.cursor()
    sql = "UPDATE `wxapp`.`user` SET `birthday` = '{}' WHERE `id` = {}".format(request.form.get('birthday'),request.form.get('id'))
    cursor.execute(sql)
    connect.commit()
    return "submit ok"


@app.route('/test', methods=["POST"])
def test():
    print(request.form.get('code'))
    return request.form.get('code')


# def test():
#     url = "127.0.0.1:5000"
#     data = '{"code":"123"}'
#     res = requests.post(url=url,data=data)
#     print(res.text)

if __name__ == '__main__':
    app.run()
