package models

type UserTestResult struct {
	Openid string
	TestOrder int
	PlanScore float64
	AttentionScore float64
	SimulScore float64
	SucScore float64
	TotalScore float64
	Flag int
}