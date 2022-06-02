package model

type Hashtags struct {
	ID string `json:"id"`
	Name string `json:"name"`
	tableName struct{}`pg:"Hashtags"`
}

