package models

type Detail struct {
	TestId   string `db:"test_id"`
	Category int    `db:"category"`
	Details  string `db:"details"`
}

type Details struct {
	Details []Detail
}
