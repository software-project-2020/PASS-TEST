package models

type Configuration struct {
	TestId        string `db:"test_id"`
	Difficulty    int    `db:"difficulty"`
	AgeGroup      int    `db:"age_group"`
	ParameterInfo string `db:"parameter_info"`
}

type Configurations struct {
	Configurations []Configuration
}
