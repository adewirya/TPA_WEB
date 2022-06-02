package model

type PostContent struct {
	ID string `json:"id"`
	PostID string `json:"post_id"`
	Type string `json:"type"`
	Path string `json:"path"`
	tableName struct{}`pg:"PostContent"`
}
