# -*- coding: utf-8 -*-
"""
@Author  : guohaoyuan
@Time    : 2020/12/15 上午12:27
"""

from flask import Flask, request
import requests
import base64
import json
import os

feedBackPostUrl = "http://localhost:8080/api/user/feedback"
url = "xxxx/xxx/"

app = Flask(__name__)


@app.route('/feedback', methods=['POST'])
def addnote():
    openid = request.form['openid']
    if openid == "":
        return "openid字段为空"
    feedback_type = request.form['feedback_type']
    if feedback_type == "":
        return "feedback_type字段为空"
    contact_info = request.form['contact_info']
    if contact_info == "":
        return "contact_info字段为空"
    feedback_content = request.form['feedback_content']
    if feedback_content == "":
        return "feedback_content字段为空"
    imagelist = request.form['imagelist']
    imagelist = json.loads(imagelist)
    size = len(os.listdir("./images"))
    sendlist = []
    for image in imagelist:
        image = base64.b64decode(image)
        size += 1
        locate = str(size) + ".jpg"
        f = open("./images/" + locate, 'wb')
        f.write(image)
        f.close()
        sendlist.append(url + locate)
    postData = {
        "openid":openid,
        "feedback_type":feedback_type,
        "contact_info":contact_info,
        "feedback_content":feedback_content,
        "imagelist":json.dumps(sendlist)
    }
    res = requests.post(url,postData)
    return "d"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)
