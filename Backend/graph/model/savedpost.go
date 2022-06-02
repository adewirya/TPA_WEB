package model

type SavedPost struct {
	ID string `json:"id"`
	PostID string `json:"post_id"`
	UserID string `json:"user_id"`
	IsSaved bool `json:"is_saved"`
	tableName struct{}`pg:"SavedPost"`
}

