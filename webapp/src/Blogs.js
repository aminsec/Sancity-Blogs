import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./css/Blogs.css";
import { checkIsUserLogin } from './Login';

function Blogs(){
    const [saveBlog, setSaveBlog] = useState(false);
    const [liked, setLiked] = useState(false);
    const [blogLikes, setBlogLikes] = useState();
    const [blogData, setBlogData] = useState("");
    const [userInfo, setUserInfo] = useState();
    const [isUserLogin, setIsUserLogin] = useState();
    const [commentsOff, setCommentsOff] = useState(true);
    let [comments, setComments] = useState([]);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentBoxLimit, setCommentBoxLimit] = useState(276);
    const [summaryPage, setSummaryPage] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryResponse, setSummaryResponse] = useState();
    const [summaryError, setSummaryError] = useState();
    const [aiRequestUsed, setAiRequestUsed] = useState();
    const [commentError, setCommentError] = useState();
    const [commentsLen, setCommentsLen] = useState();
    let [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(5);
    let { blogId } = useParams();
    const navigate = useNavigate();

    //changing format of dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-GB', options);
        };  

    //Checkig user authentication state to allow commenting 
    useEffect(() => {
        async function fetchData(){
            const request = await fetch("/api/v1/user/info", {
                method: "GET",
                credentials: "include"
            })
            if(request.ok){
                if(request.redirected){
                    setIsUserLogin(false);
                }else if(!request.redirected){
                    setIsUserLogin(true);
                    const data = await request.json();
                    setUserInfo(data);
                }
            }
        }
        fetchData();

    }, []);  

    //Getting blogs 
    useEffect(() => {
        var http = new XMLHttpRequest();
        http.open("GET", `/api/v1/blogs/${blogId}`);
        http.withCredentials = true;
        http.send();
    
        http.onreadystatechange = async function(){
            if(http.readyState == 4){
                if(http.status !== 200){
                    window.location.href = "/not-found";
                    return
                }
                var data = JSON.parse(http.responseText);
                if(data.state == "success"){
                    const request = await fetch(`/api/v1/user/likes`);
                    const request2 = await fetch(`/api/v1/user/favorites`); 
                    if(request.redirected != true && request2.redirected != true){
                        const likedBlogs = await request.json();
                        const saveBlogs = await request2.json();
                        if(likedBlogs.blogs_id.includes(data.content.blog_id.toString())){
                            setLiked(true);
                        }else{
                            setLiked(false);
                        }

                        if(saveBlogs.blogs_id.includes(data.content.blog_id.toString())){
                            setSaveBlog(true);
                        }else{
                            setSaveBlog(false);
                        }
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
        async function loadComments(){
            const request = await fetch(`/api/v1/blogs/${blogId}/comments?offset=${offset}&limit=${limit}`, { method: "GET" });
            if(request.ok){
                const data = await request.json();
                if(data.state === "success"){
                    setCommentsLen(data.allCommentsLen);
                    const request2 = await fetch(`/api/v1/user/comments/liked-comments`);
                    if(request2.redirected != true){
                        const data2 = await request2.json();
                        for(let comment of data.comments){
                            if(data2.liked_comments.includes(comment.Id.toString())){
                                comment.isLiked = true;
                                setComments((prevComments) => [...prevComments, comment]);
                            }else{
                                comment.isLiked = false;
                                setComments((prevComments) => [...prevComments, comment]);
                            }
                        }
                    }else{
                        setComments((prevComments) => [...prevComments, ...data.comments]);
                    }
                   
                }
            }
        }
    
        loadComments();
    }, [blogId, offset, limit]);

    //To delete comment
    async function deleteComment(commentId){
        const request = await fetch(`/api/v1/user/comments/${commentId}/delete`, {
            method: "DELETE",
            credentials: "include"
        })
        if(request.ok){
            const data = await request.json();
            if(data.state == "success"){
                window.location.reload();
            }
        }
    }

    function changeNumberOfCommentLikes(commentId){
        var allComments = comments;
        for(var index = 0; index < allComments.length; index++){
            if(allComments[index].Id == commentId && allComments[index].isLiked == true){
                console.log("liking")
                var currentLike = Number(document.getElementById(commentId + "-number").innerHTML); 
                currentLike -= 1;
                document.getElementById(commentId + "-number").innerHTML = currentLike;
                document.getElementById(commentId).src = "/statics/img/commentLike.png";
                comments[index].isLiked = false;
                fetch(`/api/v1/user/comments/${commentId}/like`, {
                    "method": "GET",
                    "credentials": "include"
                })
                break

            }if(allComments[index].Id == commentId && allComments[index].isLiked == false){
                console.log("disliking")
                var currentLike = Number(document.getElementById(commentId + "-number").innerHTML); 
                currentLike += 1;
                document.getElementById(commentId + "-number").innerHTML = currentLike;
                document.getElementById(commentId).src = "/statics/img/commentLiked.png";
                comments[index].isLiked = true;
                fetch(`/api/v1/user/comments/${commentId}/like`, {
                    "method": "GET",
                    "credentials": "include"
                })
                break
            }
        }
    }

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

    function setNewLimit(){
        const writtedComment = document.getElementById("add-comment-textarea").value;
        const writtedCommentLength = writtedComment.length;
        const allowedCommentLength = commentBoxLimit - writtedCommentLength;
        document.getElementById("add-comment-allowed-len").innerText = allowedCommentLength;
    }

    async function submitComment(){
        var commentData = {};
        var comment = document.getElementById("add-comment-textarea").value;
        commentData.comment = comment;
        const request = await fetch(`/api/v1/user/comments/${blogId}/addComment`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(commentData),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if(request.ok){
            const data = await request.json();
            if(data.state == "success"){
                setShowCommentBox(false);
                window.location.reload();
            }else{
                setCommentError(data.message)
            }
        }
    }

    async function generateSummary(){
        setSummaryError(null);
        setSummaryResponse(null);
        setSummaryPage(true);
        setSummaryLoading(true);
        const request = await fetch(`/api/v1/user/ai/summary`, {
            method: "POST",
            body: JSON.stringify({blogId: blogId}),
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if(request.redirected){
            window.location.href = "/login";
            return
        }

        if(request.ok){
            const data = await request.json();
            if(data.state == "success"){
                setSummaryLoading(false);
                setSummaryResponse(data.notes);
                setAiRequestUsed(data.used_ai);
            }
        }else{
            const data = await request.json();
            setSummaryLoading(false);
            setSummaryResponse(null);
            setSummaryError(data.message)
        }
    }
    
    return(
        <>
            {summaryPage == true && 
            <>
                <div id="wall"></div> 
                <div id="summary-container">
                    <h1 id="summary-title">Summary of this blogs: </h1>
                    <img id="summary-close-icon" src="/statics/img/reject.png" onClick={() => {setSummaryPage(false); setSummaryLoading(false)}}></img>
                    {summaryLoading == true && 
                        <div id="summary-loading">
                            <h3 id="summary-loading-text">Requesting from ai ...</h3>
                            <div id="summary-loading-icon"></div>
                        </div>
                    }
                    {summaryResponse != null && 
                        <>
                            {summaryResponse.map((note, index) => (
                                <div className='summary-resp-div' key={index} style={{ animationDelay: `${index * 0.2}s` }}>
                                    <li className="summary-note" style={{ animationDelay: `${index * 0.2}s` }}>{note}</li>
                                </div>
                            ))}

                            <p id="summary-left-req">You have used {aiRequestUsed}/5 requests today</p>
                        </>
                    }
                    {summaryError != null && 
                        <>
                            <div id="summary-error-div">
                                <h3>Oh no!</h3>
                                <p id="summary-error">{summaryError}</p>
                            </div>
                        </>
                    }
                </div>
                
            </>
            }
            <img id="BlogsPage-back" src="/statics/img/back.png" onClick={() => {navigate(-1)}}></img>
            <img id="BlogsPage-image" src={blogData.blog_image}></img>
            <h1 id="BlogsPage-titleBlog">{blogData.blog_title}</h1>
            <hr id="line-of-under-title"></hr>
            {userInfo && blogData && showCommentBox == true && 
            <>                       
                <div id="wall"></div> 
                <div id="add-comment-box-div">
                    <img onClick={() => {setShowCommentBox(false)}} id="close-comment-box" src="/statics/img/reject.png"></img>
                    <h2 id="add-comment-title">Leave a comment for {blogData.user.username}</h2>
                    <img id="add-comment-userPic" src={userInfo.profilePic}></img>
                    <button id="add-comment-submit" onClick={submitComment}>Send</button>
                    <h3 id="add-comment-allowed-len">276</h3>
                    <textarea id="add-comment-textarea" placeholder='Leave a comment...' maxLength="276" onChange={setNewLimit} ></textarea>
                    {commentError && <p id="add-comment-error">{commentError}</p>}
                </div>                          
            </>
            }
            <div id="BlogsPage-body-content-div">
                <p id="BlogsPage-body-content">{blogData.blog_content}</p>
                <div id="endInfo">
                    <img id="blogs-blogOwner-profile" src={blogData.user ? blogData.user.profilePic : ""} onClick={() => {navigate( "/writer/" + blogData.user.userid)}}></img>
                    <a href={blogData.user ? "/writer/" + blogData.user.userid : ""} id="blogs-blogOwner-username">{blogData.user ? blogData.user.username : ""}</a>
                   <img id="BlogsPage-comment" className='blogs-end-options' src={commentsOff ? "/statics/img/commentOff.png" : "/statics/img/comment.png"} onClick={() => {if(commentsOff == false){setShowCommentBox(true) /*navigate("comments")*/}}}></img>
                   <img id="BlogsPage-like" className='blogs-end-options' src={liked ? "/statics/img/liked.png" : "/statics/img/heart.png"} onClick={like}></img>
                   <img id="BlogsPage-save" className='blogs-end-options' src={saveBlog ? "/statics/img/saved.png" : "/statics/img/save.png"} onClick={save}></img>
                   <button id="BlogsPage-summarize" onClick={generateSummary}>Summarize ✨</button>
                   <p  id="BlogsPage-like-numbers">{blogData.likes != null ? blogLikes : "0"}</p>
                </div>
                
                {comments && comments.length > 0 && 
                <div id="BlogsPage-comments-portion-div">
                    <hr id="BlogsPage-hr-comments"></hr>
                    {comments.map((comment) => (
                        <>
                            <div className='BlogsPage-comment-div'>
                                <img className='BlogsPage-comment-userProfilePic' src={comment.user.profilePic} onClick={() => {navigate(`/writer/${comment.user.userid}`)}}></img>
                                <p className='BlogsPage-comment-date'>{formatDate(Number(comment.date))}</p>
                                {isUserLogin && isUserLogin == true && comment.user.username == userInfo.username && <img id={comment.Id + "deleteICN"} onClick={() => {deleteComment(comment.Id)}} onMouseOver={() => {document.getElementById(comment.Id + "deleteICN").src = "/statics/img/delete.png"}} onMouseLeave={() => {document.getElementById(comment.Id + "deleteICN").src = "/statics/img/del.png"}} src="/statics/img/del.png" className='BlogsPage-comment-delete'></img>} 
                                <img id={comment.Id} className='BlogsPage-comment-like' src={comment.isLiked == true ? "/statics/img/commentLiked.png" : "/statics/img/commentLike.png"} onClick={() => {

                                    if(isUserLogin == true){
                                        changeNumberOfCommentLikes(comment.Id)
                                    }else{
                                        navigate("/login");
                                    }
                                }}></img>
                                <p id={comment.Id + "-number"} className='BlogsPage-comment-likeNumbers'>{comment.likes}</p>
                                
                                <p className='BlogsPage-comment-user'>Comment By <a id="BlogsPage-comment-user-a" href={`/writer/${comment.user.userid}`}>{comment.user.username}</a></p>
                                <hr className='BlogsPage-comment-hr'></hr>
                                <p className='BlogsPage-comment-userComment'>{comment.comment}</p>
                            </div>                           
                        </> 
                    ))}
                </div>
                }
                {comments.length < commentsLen && 
                    <button id="load-more-comments" onClick={() => {offset += 5; setOffset(offset)}}>Load more</button>
                }
            </div>
        </>
    )
}

export default Blogs;