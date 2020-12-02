package models

import "time"

type User struct {
	Id            int       `db:"id"`
	Openid        string    `db:"openid"`
	SessionKey    string    `db:"session_key"`
	Age           int       `db:"age"`
	Gender        int       `db:"gender"`
	RegisterTime  time.Time `db:"register_time"`
	LastLoginTime time.Time `db:"lastLogin_time"`
	NickName      string    `db:"nickname"`
	Birthday      time.Time `db:"birthday"`
}
