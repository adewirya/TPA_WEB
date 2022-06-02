import {gql} from '@apollo/client'

export const NEW_USER = 
gql`
    mutation insertNewUser (
        $username : String!,
        $full_name : String!,
        $email :String!,
        $password : String!,
        $is_google : Boolean!,
        $is_verified : Boolean!
    ){
        register(input:{
            username : $username,
            full_name : $full_name
            email : $email,
            password : $password,
            is_google : $is_google,
            is_verified : $is_verified
        })  	
    } 
`

export const UPDATE_USER =
gql`
    mutation updateUser(
        $id :String!,
        $username :String!,
        $email : String!,
        $password : String!,
        $is_google :Boolean!
    ){
        updateUser(id : $id, 
        input:{
        username : $username,
        email : $email,
        password: $password,
        is_google : $is_google
        })
        
        {
        username,
        email,
        password,
        is_google
        }
    }

`

export const DELETE_USER = 
gql`
    mutation deleteUser (
        $id : String!
    ){
        deleteUser(id : $id)
    }
`


export const LOGIN_USER = 
gql`
    mutation LoginUser(
        $username : String!,
        $password : String!
    )
    {
        login(input:{
        user_or_email : $username,
        password :$password
        })  
    }
`

export const LOGIN_GOOGLE = gql`
  mutation LoginGoogle($accessToken: String!) {
    loginGoogle(access_token: $accessToken)
  }
`;



export const VERIFY_USER = 
gql`
    mutation verifyUser(
        $token :String!,
        $email :String!
    ){
        verifyUser(input:{
        token :$token,
        email :$email
        })
    }
`

export const RESEND_VERIFY = 
gql`
    mutation resendVerification(
        $email : String!
    ){
        resendVerification(input:{
        email: $email
        })
    }
`

export const SEND_GMAIL_RESET  =
gql`
    mutation sendGmailOnReset ($email :String!){
        sendGmailOnReset(email: $email)
    }
`

export const RESET_PASSWORD = 
gql`
    mutation resetPassword(
    $token :String!,
    $password :String!
    )
    {
    resetPassword(input:{
        token :  $token,
        password :$password
    })
    }
`


export const GET_USER =gql`
mutation getUser($token :String!){
  sendUserBasedOnJWT(token : $token)
  {
    user_id
    username
    full_name
    email
	  password
    	
  	mutual_users{
      username
      profile_picture
      
    }
  }

}
`

export const SEARCH_USER = 
gql`
mutation search ($username :String!){
  sendUserBasedOnUsername(username: $username)
    {
      user_id
      username
      email
      password
      full_name
      
      saved_post{
        post_id
      }
      
      tagged_post{
        post_id
      }
      
    }
}

`

export const GET_FOLLOW_STATUS = 
gql`
mutation getFollowStatus($id :ID!, $targetId :ID!){
    getFollowStatus(id:$id, targetId:$targetId)
  }
`

export const FOLLOW = 
gql`
mutation follow($id :ID!, $targetId :ID!){
    follow(id:$id, targetId:$targetId)
  }
`

export const UNFOLLOW = 
gql`
mutation unfollow($id :ID!, $targetId :ID!){
    unfollow(id:$id, targetId:$targetId)
  }
`


export const ADD_POST = gql`
    mutation postAdd($input:NewPost!){
        addNewPost(input:$input){
            id
            caption
        }
    }
`

export const GET_ALL_POST = gql`
mutation getAllPost($id: ID!){
    selectAllPost(id :$id){
        id
        caption
        user_id
        post_contents{
            id
            path
            type
        }
    }
}
`

export const SEARCH_USER_HEADER = gql`
mutation searchUser($username :String!, $currUser : String!){
  
  searchUserAuto(username:$username, currUser: $currUser)
  
  searchUser(username: $username, currUser : $currUser){
    username	
    user_id
    full_name
    email
  }
  
  searchHashtag(hashtag : $username)
  {
    name
  }
}
`

export const SELECT_POST_BASED_ID = gql`
mutation getPostBasedId ($postId :ID!){
    selectPostBasedID(id : $postId){
    id
    post_like
    caption
    post_contents{
      type
      id
      path
    }
    user_id
  }
}
`


export const GET_POST_BASED_ID = gql`
mutation postDetailSelect ($postId : ID!, $id :ID!){
  getAllComment (post_id : $postId)
  {
    id
    sender_username
    comments
    comment_like
  }

  isSavedPost(user_id : $id, post_id :$postId)
  
  selectPostBasedID(id : $postId){
    id
    post_like
    caption
    post_contents{
      type
      id
      path
    }
    user_id
  }
  
}
`


export const LIKE_POST = gql`
mutation likePost($postId : ID!){
  likePost(id:$postId)
}

`

export const UNLIKE_POST = gql`
mutation unLikePost($postId : ID!){
  unLikePost(id:$postId)
}
`
export const SAVE_POST = gql`
mutation savePost($postId : ID!, $id :ID!){
    savePost(user_id:$id, post_id:$postId)
  }
`

export const UNSAVE_POST = gql`
mutation unsavePost($postId : ID!, $id :ID!){
    unsavePost(user_id:$id, post_id:$postId)
  }
`
export const ADD_COMMENT = gql`
mutation addComment($comment :String!, $postId :ID!, $username : String!){
    addComment(username: $username,comment:$comment, post_id :$postId)
  }
`

export const LIKE_COMMENT = gql`
mutation likeComment($commentId :ID!){
    addCommentLike(id : $commentId)
  }
`

export const UNLIKE_COMMENT = gql`
mutation unlikeComment($commentId :ID!){
	unlikeComment(id : $commentId)
}
`

export const GET_ALL_COMMENT = gql`
mutation getAllComment($postId :ID!){
    getAllComment (post_id : $postId)
    {
      id
      sender_username
      comments
      comment_like
    }
  }

`
export const DELETE_COMMENT = gql`
mutation deleteComment($commentId :ID!){
  deleteComment(id :$commentId)
}
`

export const ADD_REPLY = gql`
mutation addReply($commentId :ID!, $msg :String!, $sender :String!){
  addReply(comment_id: $commentId, msg : $msg, sender : $sender)
}
`

export const GET_ALL_REPLY = gql`
mutation getAllReply($commentId :ID!){
  getAllReply(comment_id : $commentId){
    id
    comment_id
    reply
    sender
  }
}
`

export const DELETE_REPLY = gql`
mutation deleteReply ($replyId : ID!){
  deleteReply(reply_id : $replyId)
} 
`

export const SELECT_EXPLORER = gql`
mutation selectPostExplorer ($nextpost : String){
  selectPostExplorer(nextpost : $nextpost)
  {
    posts{
      id
      user_id
      caption
      created_at
      post_like
      post_contents{
        id
        post_id
        type
        path
      }
    }
    nextposts
    hasnext
  }
}

`

export const SELECT_ALL_HOMEPAGE= gql`
mutation selectPostHomepage($nextpost : String, $uid :ID!){
  selectHomepage(userid : $uid , nextpost :$nextpost){
    posts{
      id
      user_id
      caption
      created_at
      post_like
      post_contents{
        id
        type
        path
      }
    }
    
    nextposts
    hasnext
  }
}
`

export const GET_USER_BASED_ID = gql`
mutation getUserBasedId($uid :ID!){
  getUserBasedID(user_id :$uid)
  
  {
    profile_picture
    user_id
    full_name
    username
    email
    password
    is_google
    is_verified

    saved_post{
      post_id
    }

    history{
      history
    }
    
    posts{
      id
      user_id
      caption
      created_at
      post_like
      post_contents{
        post_id
        type
        path
      }
    }
    
    followed_id{
      target_id
    }
  }
}

`

export const ADD_HISTORY = gql`
mutation addHistory($uid : ID!, $history : String!){
  addHistory(user_id : $uid, history :$history)
}

`

export const DELETE_POST = gql`
mutation deletePost($postId :ID!){
  deletePost(post_id :$postId)
}
`

export const CHANGE_CAPTION = gql`
mutation changeCaption ($postId: ID!, $caption :String!){
  changePostCaption(post_id :$postId, caption :$caption)
}
`