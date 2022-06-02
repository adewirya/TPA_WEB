package model

type UserRelation struct {
	ID string `json:"id"`
	UserId int `json:"user_id"`
	TargetId int `json:"target_id"`
	IsFollow bool `json:"is_follow"`
	tableName struct{}`pg:"UserRelation"`
}

