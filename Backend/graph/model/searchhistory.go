package model

type SearchHistory struct {
	tableName struct{} `pg:"SearchHistory"`
	ID string `json:"id"`
	UserId string `json:"user_id"`
	History string `json:"history"`
}
