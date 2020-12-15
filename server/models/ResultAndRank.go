package models

import "time"

type ResultAndRank struct {
	Openid string
	TestOrder int
	PlanScore float64
	PlanRank int
	AttentionScore float64
	AttentionRank int
	SimulScore float64
	SimulRank int
	SucScore float64
	SucRank int
	CostTime int
	TestDate time.Time
	SumPeople int
	TotalScore float64
	TestId int
}
