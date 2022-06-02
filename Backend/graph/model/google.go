package model

type GoogleInfo struct {
	Email   string `json:"email"`
	Username string `json:"username"`
	FullName    string `json:"full_name"`
	ProfilePicture string `json:"profile_picture"`
}