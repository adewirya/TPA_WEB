import React from "react";
import UserNavbar from "../Components/Navbars/UserNavbar";
import StartFollowing from "../Components/ActivityComponents/StartFollowing";
import LikeComment from "../Components/ActivityComponents/LikeComment";
import LikePost from "../Components/ActivityComponents/LikePost";
import TagPost from "../Components/ActivityComponents/TagPost"; 
import MentionStory from "../Components/ActivityComponents/MentionStory";
import MentionComment from "../Components/ActivityComponents/MentionComment";

export default function Activity(){








    return (

        <div className="activity-page">
            <UserNavbar></UserNavbar>

            <div className="activity">
                <div className="content">
                <StartFollowing></StartFollowing>
                                <StartFollowing></StartFollowing>
                                <StartFollowing></StartFollowing>
                                <LikeComment></LikeComment>
                                <LikeComment></LikeComment>                                
                                <LikeComment></LikeComment>
                                <LikePost></LikePost>
                                <LikePost></LikePost>
                                <LikePost></LikePost>
                                <MentionComment></MentionComment>
                                <MentionComment></MentionComment>
                                <MentionComment></MentionComment>
                                <MentionStory></MentionStory>
                                <MentionStory></MentionStory>
                                <MentionStory></MentionStory>
                                <TagPost></TagPost>
                                <TagPost></TagPost>
                                <TagPost></TagPost>
                </div>
            </div>

        </div>

    )
}