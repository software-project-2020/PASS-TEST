#-*- coding: utf-8 -*-
"""
@Author  : guohaoyuan
@Time    : 2020/12/15 上午12:32
"""
import base64

import requests
import json
f = open("./images/1.jpg",'rb')
pic = f.read()
image_base64 = str(base64.b64encode(pic), encoding='utf-8')
print(image_base64)
print(len(pic))
l = []
l.append(image_base64)
l.append(image_base64)
print(l)
url = "http://localhost:8080/feedback"
post = {
    "openid":"111",
    "feedback_type":"2",
    "contact_info":"123",
    "feedback_content":"sss",
    "imagelist":json.dumps(l)
}
print(post)
res =requests.post(url,post)
print(res.text)