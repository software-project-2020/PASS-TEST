package driver

import (
	"database/sql"
	"fmt"
	"log"
	"time"
)

var Db *sql.DB

func ConnectSQL() *sql.DB {
	fmt.Println(time.Now())
	fmt.Println("系统启动的时候就加载(并不是用户访问的时候加载) 因为连接池 只是用户使用的时候就会建立连接 用完返回")
	var err error
	Db, err = sql.Open("mysql", "pass:pass@tcp(127.0.0.1:3306)/PASSGO?charset=utf8mb4&parseTime=true&loc=Local")
	if err != nil {
		log.Panicln("err:", err.Error())
	}
	// 参数为0 表示无限制
	Db.SetMaxOpenConns(2000)
	Db.SetMaxIdleConns(1000)
	return Db
}
