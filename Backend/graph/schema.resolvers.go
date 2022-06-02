package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"TPANK/graph/authentication"
	"TPANK/graph/generated"
	"TPANK/graph/model"
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
)

func (r *mutationResolver) AddHistory(ctx context.Context, userID string, history string) (string, error) {
	temp := model.SearchHistory{
		History: history,
		UserId:  userID,
	}

	_, err := r.DB.Model(&temp).Insert()

	if err != nil {
		return "", err
	}

	return "success", nil
}

func (r *mutationResolver) ChangePostCaption(ctx context.Context, postID string, caption string) (string, error) {
	var post model.Post

	_, err := r.DB.Model(&post).Set("caption = ? ", caption).Where("id = ?", postID).Update()

	if err != nil {
		return "", err
	}

	return "succes", nil
}

func (r *mutationResolver) GetUserBasedID(ctx context.Context, userID string) (*model.User, error) {
	var user model.User

	err := r.DB.Model(&user).Where("user_id = ?", userID).First()

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *mutationResolver) SelectHomepage(ctx context.Context, userid string, nextpost *string) (*model.PostPagged, error) {
	var relations []*model.UserRelation

	err := r.DB.Model(&relations).Where("user_id = ? and is_follow = true", userid).Select()

	if err != nil {
		return nil, err
	}

	//var user model.User

	nuser := len(relations)

	users_id := make([]string, nuser)

	//log.Println(relations)

	for i, u := range relations {
		users_id[i] = strconv.Itoa(u.TargetId)
	}

	users_id = append(users_id, userid)

	if len(users_id) == 0 {
		return nil, errors.New("no following")
	}

	var posts []*model.Post
	query := r.DB.Model(&posts)

	if nextpost != nil {
		query = query.Where("id <= ?", nextpost).WhereIn("user_id in(?)", users_id)
	} else {
		query = query.WhereIn("user_id in (?)", users_id)
	}

	err = query.Relation("PostContents").Order("id desc").Limit(4).Select()
	if err != nil {
		return nil, err
	}
	var postPagged model.PostPagged
	postLength := len(posts)
	if postLength == 4 {
		postPagged.Posts = posts[:postLength-1]
		postPagged.Nextposts = posts[postLength-1].ID
		postPagged.Hasnext = true
	} else {
		postPagged.Posts = posts
		postPagged.Hasnext = false
	}
	return &postPagged, nil
}

func (r *mutationResolver) SearchHashtag(ctx context.Context, hashtag string) ([]*model.Hashtags, error) {
	var hashtags []*model.Hashtags

	err := r.DB.Model(&hashtags).Where("name LIKE ?", "%"+hashtag+"%").Select()

	if err != nil {

		return nil, err
	}

	return hashtags, nil
}

func (r *mutationResolver) SelectPostExplorer(ctx context.Context, nextpost *string) (*model.PostPagged, error) {
	var posts []*model.Post
	query := r.DB.Model(&posts)

	if nextpost != nil {
		query = query.Where("id <= ? and DATE_PART('day',current_date::timestamp - created_at::timestamp) <= 7", nextpost)
	} else {
		query = query.Where("DATE_PART('day',current_date::timestamp - created_at::timestamp) <= 7")
	}

	err := query.Relation("PostContents").Order("id desc").Limit(4).Select()
	if err != nil {
		return nil, err
	}

	var postPagged model.PostPagged
	postLength := len(posts)
	if postLength == 4 {
		postPagged.Posts = posts[:postLength-1]
		postPagged.Nextposts = posts[postLength-1].ID
		postPagged.Hasnext = true
	} else {
		postPagged.Posts = posts
		postPagged.Hasnext = false
	}
	return &postPagged, nil
}

func (r *mutationResolver) AddReply(ctx context.Context, commentID string, msg string, sender string) (string, error) {
	reply := model.CommentReply{
		Reply:     msg,
		CommentId: commentID,
		Sender:    sender,
	}

	_, err := r.DB.Model(&reply).Insert()

	if err != nil {
		return "", err
	}

	return "succesfully added reply", nil
}

func (r *mutationResolver) DeleteReply(ctx context.Context, replyID string) (string, error) {
	var reply model.CommentReply

	_, err := r.DB.Model(&reply).Where("id = ?", replyID).Delete()

	if err != nil {
		return "", err
	}

	return "success", nil
}

func (r *mutationResolver) GetAllReply(ctx context.Context, commentID string) ([]*model.CommentReply, error) {
	var reply []*model.CommentReply

	err := r.DB.Model(&reply).Where("comment_id = ?", commentID).Select()

	if err != nil {

		return nil, err
	}

	return reply, nil
}

func (r *mutationResolver) DeleteComment(ctx context.Context, id string) (string, error) {
	var com model.PostComments

	_, err := r.DB.Model(&com).Where("id = ?", id).Delete()

	if err != nil {
		return "", err
	}

	return "deleted succesfully", nil
}

func (r *mutationResolver) IsSavedPost(ctx context.Context, userID string, postID string) (bool, error) {
	var temp model.SavedPost

	err := r.DB.Model(&temp).Where("user_id = ? and post_id = ? and is_saved = true", userID, postID).First()

	if err != nil {

		return false, nil
	}

	return true, nil
}

func (r *mutationResolver) LikePost(ctx context.Context, id string) (string, error) {
	var post model.Post

	_, err := r.DB.Model(&post).Set("post_like = post_like + 1").Where("id = ?", id).Update()

	if err != nil {
		return "", err
	}

	return "Success", nil
}

func (r *mutationResolver) UnLikePost(ctx context.Context, id string) (string, error) {
	var post model.Post

	_, err := r.DB.Model(&post).Set("post_like = post_like - 1").Where("id = ?", id).Update()

	if err != nil {
		return "", err
	}

	return "Success", nil
}

func (r *mutationResolver) SavePost(ctx context.Context, userID string, postID string) (string, error) {
	var savedPost model.SavedPost

	err := r.DB.Model(&savedPost).Where("post_id = ? and user_id = ?", postID, userID).First()

	if err == nil {

		_, err2 := r.DB.Model(&savedPost).Set("is_saved = true").Where("post_id = ? and user_id = ?", postID, userID).Update()

		if err2 != nil {
			return "", err2
		}

		return "Succesfully updated", nil
	}

	savedPostTemp := model.SavedPost{
		PostID:  postID,
		UserID:  userID,
		IsSaved: true,
	}

	_, err4 := r.DB.Model(&savedPostTemp).Insert()

	if err4 != nil {
		return "", err4
	}

	return "Successfully added to saved", nil
}

func (r *mutationResolver) UnsavePost(ctx context.Context, userID string, postID string) (string, error) {
	var savedPost model.SavedPost

	_, err2 := r.DB.Model(&savedPost).Set("is_saved = false").Where("post_id = ? and user_id = ?", postID, userID).Update()

	if err2 != nil {
		return "", err2
	}

	return "Succesfully unsaved", nil
}

func (r *mutationResolver) AddComment(ctx context.Context, username string, comment string, postID string) (string, error) {
	postComment := model.PostComments{
		PostID:         postID,
		Comments:       comment,
		CommentLike:    0,
		SenderUsername: username,
	}

	_, err := r.DB.Model(&postComment).Insert()

	if err != nil {
		return "", err
	}

	return "comment added succesfully", nil
}

func (r *mutationResolver) GetAllComment(ctx context.Context, postID string) ([]*model.PostComments, error) {
	var comments []*model.PostComments

	err := r.DB.Model(&comments).Where("post_id = ?", postID).Select()

	if err != nil {
		return nil, err
	}

	return comments, nil
}

func (r *mutationResolver) DeletePost(ctx context.Context, postID string) (string, error) {
	var post model.Post

	_, err := r.DB.Model(&post).Where("id = ?", postID).Delete()

	if err != nil {
		return "", err
	}

	return "Post deleted Succesfully", nil
}

func (r *mutationResolver) AddCommentLike(ctx context.Context, id string) (string, error) {
	var comment model.PostComments

	_, err := r.DB.Model(&comment).Set("comment_like = comment_like + 1").Where("id = ?", id).Update()

	if err != nil {
		return "", err
	}

	return "liked succesfully", nil
}

func (r *mutationResolver) UnlikeComment(ctx context.Context, id string) (string, error) {
	var comment model.PostComments

	_, err := r.DB.Model(&comment).Set("comment_like = comment_like - 1").Where("id = ?", id).Update()

	if err != nil {
		return "", err
	}

	return "unliked succesfully", nil
}

func (r *mutationResolver) SelectPostBasedID(ctx context.Context, id string) (*model.Post, error) {
	var post model.Post

	err := r.DB.Model(&post).Where("id = ?", id).First()

	if err != nil {
		return nil, err
	}

	var postContent []*model.PostContent

	err2 := r.DB.Model(&postContent).Where("post_id = ?", id).Select()

	if err2 != nil {
		return nil, err2
	}

	post.PostContents = postContent

	return &post, nil
}

func (r *mutationResolver) SearchUserAuto(ctx context.Context, username string, currUser string) (string, error) {
	var user model.User

	if username == "" {
		return "", errors.New("username is blank")
	}

	err := r.DB.Model(&user).Where("username LIKE ? and is_verified = true and username != ?", "%"+username+"%", currUser).First()

	if err != nil {
		return "", errors.New("not found")
	}

	usernameee := user.Username

	return usernameee, nil
}

func (r *mutationResolver) SelectAllFollowedPost(ctx context.Context, id string) ([]*model.Post, error) {
	var posts []*model.Post

	var rel []*model.UserRelation

	err := r.DB.Model(&rel).Where("user_id = ? and is_follow = true", id).Select()

	if err != nil {
		return nil, err
	}

	return posts, nil
}

func (r *mutationResolver) SelectAllPost(ctx context.Context, id string) ([]*model.Post, error) {
	var post []*model.Post

	err := r.DB.Model(&post).Where("user_id = ?", id).Select()

	if err != nil {
		return nil, err
	}

	for i := range post {
		var postContext []*model.PostContent

		err2 := r.DB.Model(&postContext).Where("post_id = ?", post[i].ID).Select()

		if err2 != nil {
			post[i].PostContents = nil
		} else {
			post[i].PostContents = postContext
		}

	}

	return post, nil
}

func (r *mutationResolver) AddNewPost(ctx context.Context, input model.NewPost) (*model.Post, error) {
	user, err := r.SendUserBasedOnUsername(ctx, input.Username)

	if err != nil {
		return nil, err
	}

	post := model.Post{
		UserID:  user.UserId,
		Caption: input.Caption,
	}

	_, err = r.DB.Model(&post).Insert()
	if err != nil {
		return nil, err
	}

	nContent := len(input.Contents)
	postContents := make([]*model.PostContent, nContent)

	for i, uploadContent := range input.Contents {
		postContents[i] = &model.PostContent{
			Type:   uploadContent.Type,
			Path:   uploadContent.Path,
			PostID: post.ID,
		}
	}
	_, err = r.DB.Model(&postContents).Insert()

	if err != nil {
		return nil, err
	}

	return &post, nil
}

func (r *mutationResolver) GetFollowStatus(ctx context.Context, id string, targetID string) (bool, error) {
	var follow model.UserRelation

	err := r.DB.Model(&follow).Where("user_id = ? and target_id = ? and is_follow = true", id, targetID).First()

	if err != nil {
		return false, nil

	}

	return true, nil
}

func (r *mutationResolver) Follow(ctx context.Context, id string, targetID string) (string, error) {
	var follow model.UserRelation

	err2 := r.DB.Model(&follow).Where("user_id = ? and target_id = ?", id, targetID).First()

	if err2 == nil {
		_, err := r.DB.Model(&follow).Set("is_follow = true").Where("user_id = ? and target_id = ?", id, targetID).Update()

		if err != nil {
			return "", errors.New("error updating")
		}

		return "Succes", nil
	}

	userId, _ := strconv.Atoi(id)

	targetId, _ := strconv.Atoi(targetID)

	followTemp := model.UserRelation{
		UserId:   userId,
		TargetId: targetId,
		IsFollow: true,
	}

	_, err3 := r.DB.Model(&followTemp).Insert()

	if err3 != nil {
		return "", err3
	}

	return "Succes", nil
}

func (r *mutationResolver) Unfollow(ctx context.Context, id string, targetID string) (string, error) {
	var follow model.UserRelation

	_, err := r.DB.Model(&follow).Set("is_follow = false").Where("user_id = ? and target_id = ?", id, targetID).Update()

	if err != nil {
		return "", err
	}

	return "success", nil
}

func (r *mutationResolver) SearchUser(ctx context.Context, username string, currUser string) ([]*model.User, error) {
	var users []*model.User

	if username == "" {
		return nil, errors.New("username is blank")
	}

	err := r.DB.Model(&users).Where("username LIKE ? and is_verified = true and username != ?", "%"+username+"%", currUser).Select()

	if err != nil {
		return nil, err
	}

	return users, nil
}

func (r *mutationResolver) SendUserBasedOnUsername(ctx context.Context, username string) (*model.User, error) {
	var user model.User

	err := r.DB.Model(&user).Where("username = ?", username).First()

	if err != nil {
		return nil, errors.New("User not found")
	}

	return &user, nil
}

func (r *mutationResolver) SendUserBasedOnJwt(ctx context.Context, token string) (*model.User, error) {
	username, _ := authentication.ParseToken(token)

	var user model.User

	err := r.DB.Model(&user).Where("username = ?", username).First()

	if err != nil {
		return nil, errors.New("failed to find based on email")
	}

	return &user, nil
}

func (r *mutationResolver) SendGmailOnReset(ctx context.Context, email string) (string, error) {
	if email == "" {
		return "", errors.New("Email must be filled")
	}

	var user model.User
	err := r.DB.Model(&user).Where("email = ? and is_verified = true", email).First()

	if err != nil {
		return "", errors.New("User must exists and verified")
	}

	token, _ := authentication.GenerateToken(email)
	authentication.SendGmailOnReset(email, token)

	return "succes", nil
}

func (r *mutationResolver) ResetPassword(ctx context.Context, input model.ResetPassword) (string, error) {
	email, _ := authentication.ParseToken(input.Token)

	password := authentication.HashPassword(input.Password)
	_, err := r.DB.Model(&model.User{}).Set("password = ?", password).Where("email = ?", email).Update()

	if err != nil {
		return "", errors.New("failed to update")
	}

	return "succes", nil
}

func (r *mutationResolver) Login(ctx context.Context, input model.LoginUser) (string, error) {
	var user model.User
	err := r.DB.Model(&user).Where("username = ? and is_verified = true", input.UserOrEmail).First()

	if err != nil {
		return "", errors.New("user not found or isn't verified")
	}

	if authentication.CheckPasswordHash(input.Password, user.Password) == false {
		return "", errors.New("wrong password")
	}

	token, _ := authentication.GenerateToken(input.UserOrEmail)

	return token, nil
}

func (r *mutationResolver) Register(ctx context.Context, input model.NewUser) (string, error) {
	if input.Password == "" || input.Email == "" || input.Username == "" || input.FullName == "" {
		return "", errors.New("All field must be filled")
	}
	var user model.User
	err := r.DB.Model(&user).Where("username = ?", input.Username).First()

	if err == nil {
		return "", errors.New("Username already exists")
	}

	err3 := r.DB.Model(&user).Where("email = ?", input.Email).First()

	if err3 == nil {
		return "", errors.New("Email already exists")
	}

	userTemp := model.User{
		Username:   input.Username,
		FullName:   input.FullName,
		Email:      input.Email,
		Password:   authentication.HashPassword(input.Password),
		IsGoogle:   input.IsGoogle,
		IsVerified: input.IsVerified,
	}

	_, err2 := r.DB.Model(&userTemp).Insert()

	if err2 != nil {
		return "", errors.New("Insert new User Error")
	}

	token, _ := authentication.GenerateToken(input.Email)

	authentication.SendGmail(input.Email, token)

	return "Succes", nil
}

func (r *mutationResolver) LoginGoogle(ctx context.Context, accessToken string) (string, error) {
	client := http.Client{}
	req, err := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v2/userinfo", nil)
	if err != nil {
		return "", nil
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)

	res, err := client.Do(req)
	if err != nil {
		return "", nil
	}

	resBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", nil
	}

	var googleInfo model.GoogleInfo
	json.Unmarshal(resBody, &googleInfo)

	var user model.User
	err = r.DB.Model(&user).Where("email = ?", googleInfo.Email).First()

	if err == nil {
		token, err := authentication.GenerateToken(user.Username)
		if err != nil {
			return "", err
		}

		return token, nil
	}

	tes := strings.SplitAfter(googleInfo.Email, "@")
	full_name := strings.ReplaceAll(tes[0], "@", "")

	user = model.User{
		FullName:       full_name,
		Email:          googleInfo.Email,
		Password:       "google",
		Username:       strings.ReplaceAll(googleInfo.Email, "@", ""),
		ProfilePicture: googleInfo.ProfilePicture,
		IsGoogle:       true,
		IsVerified:     true,
	}

	_, err = r.DB.Model(&user).Insert()
	if err != nil {
		return "", err
	}

	token, err := authentication.GenerateToken(user.Username)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (r *mutationResolver) ResendVerification(ctx context.Context, input model.ResendVerification) (string, error) {
	err := r.DB.Model(&model.User{}).Where("email = ?", input.Email).First()

	if err != nil {
		return "", errors.New("invalid email")
	}

	token, _ := authentication.GenerateToken(input.Email)
	if err != nil {
		return "", err
	}

	authentication.SendGmail(input.Email, token)
	return "Succesfully Resend", nil
}

func (r *mutationResolver) VerifyUser(ctx context.Context, input model.VerificationInput) (string, error) {
	email, _ := authentication.ParseToken(input.Token)

	if email != input.Email {
		return "", errors.New("invalid token")
	}

	_, err := r.DB.Model(&model.User{}).Set("is_verified = true").Where("email = ?", email).Update()

	if err != nil {
		return "", nil
	}

	var user model.User

	err2 := r.DB.Model(&user).Where("email = ?", email).First()

	if err2 != nil {
		return "", errors.New("error in select")
	}

	username := user.Username
	token, _ := authentication.GenerateToken(username)

	return token, nil
}

func (r *mutationResolver) UpdateUser(ctx context.Context, id string, input model.NewUser) (string, error) {
	var user model.User
	err := r.DB.Model(&user).Where("user_id = ?", id).First()
	if err != nil {
		return "", errors.New("User not found")
	}

	user.Username = input.Username
	user.Email = input.Email
	user.Password = input.Password
	user.IsGoogle = input.IsGoogle
	user.FullName = input.FullName

	_, err2 := r.DB.Model(&user).Where("user_id = ?", id).Update()
	if err2 != nil {
		return "", err2
	}

	return "success", nil
}

func (r *mutationResolver) DeleteUser(ctx context.Context, id string) (bool, error) {
	var user model.User

	err := r.DB.Model(&user).Where("user_id = ?", id).First()

	if err != nil {
		return false, errors.New("User with id provided not found")
	}

	_, err2 := r.DB.Model(&user).Where("user_id = ?", id).Delete()

	if err2 != nil {
		return false, errors.New("Failed to delete User")
	}

	return true, nil
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	var users []*model.User
	err := r.DB.Model(&users).Select()
	if err != nil {
		return nil, errors.New("Failed to get Users")
	}

	return users, nil
}

func (r *queryResolver) Posts(ctx context.Context) ([]*model.Post, error) {
	var post []*model.Post

	err := r.DB.Model(&post).Select()

	if err != nil {
		return nil, err
	}

	return post, nil
}

func (r *userResolver) MutualUsers(ctx context.Context, obj *model.User) ([]*model.User, error) {


	var relations []*model.UserRelation

	err := r.DB.Model(&relations).Where("user_id = ? and is_follow = true", obj.UserId).Select()

	if err != nil{
		return nil, nil
	}

	nuser := len(relations)
	users_id := make([]string, nuser)

	for i, u := range relations {
		users_id[i] = strconv.Itoa(u.TargetId)
	}

	var otherFollowed []*model.UserRelation

	err2 := r.DB.Model(&otherFollowed).WhereIn("user_id in (?)", users_id).Where("target_id != ? and is_follow = true", obj.UserId).WhereIn("target_id not in (?) ", users_id).Select()

	if err2 != nil{

		return nil ,err2
	}

	amountMutual := len(otherFollowed)
	mutualUser := make([]string, amountMutual)

	for i, mutual := range otherFollowed {
		mutualUser[i] = strconv.Itoa(mutual.TargetId)
	}

	var mutualUsers []*model.User

	err3 := r.DB.Model(&mutualUsers).WhereIn("user_id in (?) ", mutualUser).Select()

	if err3 != nil {
		return nil, err3
	}

	return mutualUsers, nil
}

func (r *userResolver) SavedPost(ctx context.Context, obj *model.User) ([]*model.SavedPost, error) {
	var temp []*model.SavedPost

	err := r.DB.Model(&temp).Where("user_id = ? and is_saved = true", obj.UserId).Select()

	if err != nil {
		return nil, err
	}

	return temp, nil
}

func (r *userResolver) Posts(ctx context.Context, obj *model.User) ([]*model.Post, error) {
	var temp []*model.Post

	err := r.DB.Model(&temp).Where("user_id = ?", obj.UserId).Select()

	if err != nil {

		return nil, err
	}

	for i := range temp {

		var temp2 []*model.PostContent

		err2 := r.DB.Model(&temp2).Where("post_id = ?", temp[i].ID).Select()

		if err2 != nil {
			temp[i].PostContents = nil
		} else {
			temp[i].PostContents = temp2

		}
	}

	return temp, nil
}

func (r *userResolver) TaggedPost(ctx context.Context, obj *model.User) ([]*model.TaggedPost, error) {
	var temp []*model.TaggedPost

	err := r.DB.Model(&temp).Where("user_id = ?", obj.UserId).Select()

	if err != nil {
		return nil, nil
	}

	return temp, nil
}

func (r *userResolver) FollowedID(ctx context.Context, obj *model.User) ([]*model.UserRelation, error) {
	var temp []*model.UserRelation

	err := r.DB.Model(&temp).Where("user_id = ? and is_follow = true", obj.UserId).Select()

	if err != nil {
		return nil, nil
	}

	return temp, nil
}

func (r *userResolver) History(ctx context.Context, obj *model.User) ([]*model.SearchHistory, error) {
	var temp []*model.SearchHistory

	err := r.DB.Model(&temp).Where("user_id = ?", obj.UserId).Select()

	if err != nil {
		return nil, nil
	}

	return temp, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
