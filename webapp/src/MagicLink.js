import React, { useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { checkIsUserLogin } from './Login';
import "./css/MagicLinkError.css";

function MagicLink(){
    const [blogData, setBlogData] = useState();
    const [error, setError] = useState();
    const [saveBlog, setSaveBlog] = useState(false);
    const [liked, setLiked] = useState(false);
    const [blogLikes, setBlogLikes] = useState();
    const [commentsOff, setCommentsOff] = useState(true);
    let { blogId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getBlogData(){
            var url = new URLSearchParams(document.location.search)
            const token = url.get("token");
            const body = {token: token};
            const requestBody = JSON.stringify(body);
            const request = await fetch("/api/v1/blogs/magicLink", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: requestBody
            });

            if(request.ok){
                const data = await request.json();
                if(data.state == "success"){
                    if(data.content.isLiked){
                        setLiked(data.content.isLiked);
                    }
                    if(data.content.isSaved){
                        setSaveBlog(data.content.isSaved);
                    }
                    if(data.content.isCommentOff == 1){
                        setCommentsOff(true);
                    }else if(data.content.isCommentOff == 0){
                        setCommentsOff(false);
                    }
                    setBlogData(data.content);
                    setBlogLikes(data.content.likes);
                }else{
                    setError(data.message);
                }
            }else{
                const data = await request.json();
               setError(data.message)
            }
        };
        getBlogData();

    }, []);


    async function like(){
        //Checking if the user is logged in
        checkIsUserLogin(navigate);
        if(liked == false){
            setLiked(true);
            document.getElementById("BlogsPage-like").src = "/statics/img/liked.png"
            if(blogLikes !== "private"){
                setBlogLikes(blogLikes + 1);
            }
            var http = new XMLHttpRequest();
            http.open("GET", `/api/v1/user/blogs/${blogId}/like`);
            http.withCredentials = true;
            http.send();

        }else{
            document.getElementById("BlogsPage-like").src = "/statics/img/heart.png";
            setLiked(false);
            if(blogLikes !== "private"){
                setBlogLikes(blogLikes - 1);
            }
            var http = new XMLHttpRequest();
            http.open("GET", `/api/v1/user/blogs/${blogId}/like`);
            http.withCredentials = true;
            http.send();
        }
    }

    async function save(){
        await checkIsUserLogin(navigate);
        if(saveBlog == false){
            setSaveBlog(true);
            document.getElementById("BlogsPage-save").src = "/statics/img/saved.png"
            var http = new XMLHttpRequest();
            http.open("GET", `/api/v1/user/blogs/${blogId}/save`);
            http.withCredentials = true;
            http.send();
        }else{
            setSaveBlog(false);
            document.getElementById("BlogsPage-save").src = "/statics/img/save.png"
            var http = new XMLHttpRequest();
            http.open("GET", `/api/v1/user/blogs/${blogId}/save`);
            http.withCredentials = true;
            http.send();
        }
    }  


    return(
        <>
            {blogData && 
                <>
                    <img id="BlogsPage-back" src="/statics/img/back.png" onClick={() => {navigate(-1)}}></img>
                    <img id="BlogsPage-image" src={blogData.blog_image}></img>
                    <h1 id="BlogsPage-titleBlog">{blogData.blog_title}</h1>
                    <hr id="line-of-under-title"></hr>
                    <div id="BlogsPage-body-content-div">
                        <p id="BlogsPage-body-content">{blogData.blog_content}</p>
                        <div id="endInfo">

                            <img id="blogs-blogOwner-profile" src={blogData.user ? blogData.user.profilePic : ""}></img>
                            <h5 id="blogs-blogOwner-username">{blogData.user ? blogData.user.username: ""}</h5>
                        {/* <img id="BlogsPage-comment" className='blogs-end-options' src={commentsOff ? "/statics/img/commentOff.png" : "/statics/img/comment.png"} onClick={() => {if(commentsOff == false){navigate("comments")}}}></img>
                        <img id="BlogsPage-like" className='blogs-end-options' src={liked ? "/statics/img/liked.png" : "/statics/img/heart.png"} onClick={like}></img>
                        <img id="BlogsPage-save" className='blogs-end-options' src={saveBlog ? "/statics/img/saved.png" : "/statics/img/save.png"} onClick={save}></img>
                        <p  id="BlogsPage-like-numbers">{blogData.likes != null ? blogLikes : "0"}</p> */}
                        
                        </div>
                    </div>
                </>
            }

            {error && 
            
            <>
            <div id="token-error-page">
                <h1>Sorry!</h1>
                <h6>{error}</h6>
                <p>Go back to <a href="/myaccount/dashboard">Dashboard</a></p>
            </div>
            </>
            
            }
        </>

    )

}

export default MagicLink;