package model

type User struct {
	tableName struct{} `pg:"users"`

	UserId string `pg:",pk" json:"user_id"`
	Username string `json:"username"`
	FullName string `json:"full_name"`
	Email string `json:"email"`
	Password string `json:"password"`
	IsGoogle bool `json:"is_google"`
	ProfilePicture string `json:"profile_picture"`
	IsVerified bool `json:"is_verified"`
	//Post []*
}

