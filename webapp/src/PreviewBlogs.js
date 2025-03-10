import React, { useEffect, useState } from 'react';
import "./css/previewBlogs.css";
import { useParams, useNavigate } from 'react-router-dom';
import { checkIsUserLogin } from './Login';

function Preview(){
    const [userInfo, setUserInfo] = useState();
    const [blogData, setBlogData] = useState("");
    let { blogId } = useParams();
    const navigate = useNavigate();

    //Checking if user has logged in or not
    useEffect(() => {
        checkIsUserLogin(navigate)
    }, [])
    
    useEffect(() => {
        const getUserInfo = async () => {
            const request = await fetch(`/api/v1/user/info`);
            if(request.ok){
                const data = await request.json();  
                setUserInfo(data);     
            }
        }

        const getBlog = async () => {
            const request = await fetch(`/api/v1/user/blogs/${blogId}`);
            if(request.ok){
                const data = await request.json();
                if(data.state == "success"){
                    setBlogData(data.blog);
                }
            }else{
                navigate("/not-found");
                return
            }
        }

        getUserInfo();
        getBlog();
    }, []);

    return(
        <>
            <img id="preview-back" src="/statics/img/back.png" onClick={() => {navigate("/myaccount/dashboard")}}></img>
            <img id="preview-image" src={blogData.blog_image}></img>
            <h1 id="preview-titleBlog">{blogData.blog_title}</h1>
            <hr id="line-of-under-title"></hr>
            <div id="preview-body-content-div">
                <p id="preview-body-content">{blogData.blog_content}</p>
                <div id="endInfo">
                   <img id="preview-comment" src="/statics/img/comment.png"></img>
                   <img id="preview-like" src="/statics/img/heart.png"></img>
                   <img id="preview-save" src="/statics/img/save.png"></img>
                   <p id="preview-like-numbers">0</p>
                   {userInfo && 
                    <>
                        <img id="preview-user-pp" src={userInfo.profilePic}></img>
                        <p id="preview-user-username">{userInfo.username}</p>
                    </>
                   }

                </div>
            </div>
            
           
        </>
    )
    
}

export default Preview;