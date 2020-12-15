package models

import "time"

type History struct{
	Openid string
	TestId int
	TotalScore float64
	TestDate time.Time
}
