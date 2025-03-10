import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./css/Blogs.css";
import "./css/SingleComment.css";
import { checkIsUserLogin } from './Login';

function SingleComment(){
    const [saveBlog, setSaveBlog] = useState(false);
    const [liked, setLiked] = useState(false);
    const [blogLikes, setBlogLikes] = useState();
    const [blogData, setBlogData] = useState("");
    const [commentsOff, setCommentsOff] = useState(true);
    const [isCommentLiked, setIsCommentLiked] = useState();
    const [userInfo, setUserInfo] = useState();
    const [comment, setComment] = useState();
    const [isUserLogin, setIsUserLogin] = useState(false);
    let [commentLikes, setCommentLikes] = useState(0);
    let { blogId } = useParams();
    let { commentId } = useParams();
    const navigate = useNavigate();

    //changing format of dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
      
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-GB', options);
      };
    
    // getting user info
    useEffect(() => {
        async function fetchData(){
            const request = await fetch("/api/v1/user/info", {
                method: "GET",
                credentials: "include"
            })
            if(request.ok){
                if(request.redirected){
                    console.log("asd")
                    setIsUserLogin(false);
                }else if(!request.redirected){
                    const data = await request.json();
                    setIsUserLogin(true);    
                    setUserInfo(data);
                }
            }
        }
        fetchData();

    }, []);

 

    useEffect(() => {
        var http = new XMLHttpRequest();
        http.open("GET", `/api/v1/blogs/${blogId}`);
        http.withCredentials = true;
        http.send();
    
        http.onreadystatechange = function(){
            if(http.readyState == 4 && http.status == 200){
                var data = JSON.parse(http.responseText);
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
                }else if(data.state == "failed" && data.message == "Not found"){
                    navigate("/not-found");
                    return
                }
            }
        }
    
    }, []);

    useEffect(() => {
        const getComment = async () => {
            const request = await fetch(`/api/v1/blogs/${blogId}/comments/${commentId}`, {
                method: "GET"
            });
    
            if(request.ok){
                const data = await request.json();
                if(data.state == "success"){
                    const getCommentUserInfo = await fetch(`/api/v1/writers/${data.comment.userid}`, {
                        method: "GET"
                    });
                    if(getCommentUserInfo.ok){
                        const commentUser = await getCommentUserInfo.json();
                        data.comment.userInfo = commentUser.users[0];
                        console.log(data.comment);
                        setCommentLikes(data.comment.commentLikes)
                        setComment(data.comment);
                    }
                    
                }else{
                    setComment(null)
                }
            }
        }
    
        getComment();
    }, [isUserLogin]);

       //Checking if the shown comment has liked or not
       useEffect(() => {
        const checkLike = async () => {
            if(isUserLogin == true && comment){
                const request = await fetch(`/api/v1/blogs/${blogData.blog_id}/comments?limit=999999999999&offset=999999999999`, {
                    method: "GET"
                });

                if(request.ok){
                    const data = await request.json();
                    for(let vals of data.comments){
                        if(vals.Id == comment.commentId){
                            if(vals.isLiked == true){
                                setIsCommentLiked(true);
                                break
                            }
                        }
                    }
                }
            }
        }

        checkLike();

    }, [comment]);

    //scrolling down
    useEffect(() => {
    const scrollToBottom = () => {
        window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
        });
    };

    // Create a ResizeObserver to watch for changes in document size
    const resizeObserver = new ResizeObserver(() => {
        scrollToBottom();
    });

    // Observe changes in the document's body
    resizeObserver.observe(document.body);

    // Scroll to the bottom immediately after mounting
    scrollToBottom();

    // Cleanup on unmount
    return () => resizeObserver.disconnect();
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
            <img id="BlogsPage-back" src="/statics/img/back.png" onClick={() => {navigate(-1)}}></img>
            <img id="BlogsPage-image" src={blogData.blog_image}></img>
            <h1 id="BlogsPage-titleBlog">{blogData.blog_title}</h1>
            <hr id="line-of-under-title"></hr>
            <div id="BlogsPage-body-content-div">
                <p id="BlogsPage-body-content">{blogData.blog_content}</p>
                <div id="endInfo">

    
                    <img id="blogs-blogOwner-profile" src={blogData.user ? blogData.user.profilePic : ""}></img>
                    <h5 id="blogs-blogOwner-username">{blogData.user ? blogData.user.username: ""}</h5>
                    <img id="BlogsPage-comment" className='blogs-end-options' src={commentsOff ? "/statics/img/commentOff.png" : "/statics/img/comment.png"} onClick={() => {if(commentsOff == false){navigate("comments")}}}></img>
                    <img id="BlogsPage-like" className='blogs-end-options' src={liked ? "/statics/img/liked.png" : "/statics/img/heart.png"} onClick={like}></img>
                    <img id="BlogsPage-save" className='blogs-end-options' src={saveBlog ? "/statics/img/saved.png" : "/statics/img/save.png"} onClick={save}></img>
                    <p  id="BlogsPage-like-numbers">{blogData.likes != null ? blogLikes : "0"}</p>
                    

                    {comment && comment.userInfo && 
                        <>
                            <hr id="single-comment-hr"></hr>
                            <img id="comment-user-profile" onClick={() => {navigate(`/writer/${comment.userInfo.userid}`)}} src={comment.userInfo.profilePic}></img>
                            <p id="comment-date">{formatDate(Number(comment.commentedAt))}</p>
                            <img id="comment-like" onClick={() => {
                                if(isUserLogin == false) {
                                    navigate("/login");
                                    return
                                }
                                if(isCommentLiked){
                                    setIsCommentLiked(false)
                                    commentLikes -= 1;
                                    document.getElementById("comment-like").src = "/statics/img/commentLike.png"
                                    setCommentLikes(commentLikes);
                                    fetch(`/api/v1/user/comments/${commentId}/like`, {
                                        "method": "GET",
                                        "credentials": "include"
                                    })
                                }else{
                                    setIsCommentLiked(true)
                                    commentLikes += 1;
                                    document.getElementById("comment-like").src = "/statics/img/commentLiked.png"
                                    setCommentLikes(commentLikes);
                                    fetch(`/api/v1/user/comments/${commentId}/like`, {
                                        "method": "GET",
                                        "credentials": "include"
                                    })
                                }
                            }} src={isCommentLiked == true ? "/statics/img/commentLiked.png" : "/statics/img/commentLike.png"}></img>
                            <p id="comment-likes">{commentLikes}</p>
                            <h4 id="comment-text-area">{comment.comment_text}</h4>
                            <p id="commented-by-preText">Commented By <p onClick={() => {navigate(`/writer/${comment.userInfo.userid}`)}} id="commented-by"> {comment.userInfo.username}</p></p>
                        </>
                    }

                    {!comment && 
                    <div>
                        <hr id="single-comment-hr"></hr>
                        <p id="not-found-comment">Not found</p>
                    </div>
                    }
                             
                </div>
            </div>
        </>
    )
}

export default SingleComment;