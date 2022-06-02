package model

type CommentReply struct {
	ID string `json:"id"`
	Reply string `json:"reply"`
	CommentId string `json:"comment_id"`
	Sender string `json:"sender"`
	tableName struct{}`pg:"CommentReply"`
}
