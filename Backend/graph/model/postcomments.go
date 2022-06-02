package model

type PostComments struct {
	ID string `json:"id"`
	PostID string `json:"post_id"`
	Comments string `json:"comments"`
	SenderUsername string `json:"sender_username"`
	CommentLike int `json:"comment_like"`
	tableName struct{}`pg:"PostComments"`
}

