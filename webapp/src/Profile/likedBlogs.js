import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../css/Profile-liked.css"

function UserProfileLiked(){
    const { userid } = useParams();
    const [userInfo, setUserInfo] = useState();
    const [userLikedBlogs, setUserLikedBlogs] = useState([]);
    const [userNotfound, setUserNotfound] = useState();
    const navigate = useNavigate();

    //changing format of dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-GB', options);
    };

    //changing format of dates
    const getM_Y = (timestamp) => {
        const date = new Date(timestamp).toDateString(); // e.g output: 'Wed Apr 16 2014'
        const dates = date.split(' '); // seprating 
        const month = dates[1];
        const year  = dates[3];

        return month + " " + year;
    }; 

    //Getting user info
    useEffect(() => {
        const getUserInfo = async () => {
            const request = await fetch(`/api/v1/writers/${userid}`, {
                method: "GET"
            })

            if(request.ok){
                const data = await request.json();
                if(data.state == "success" && data.users.length > 0){
                    setUserInfo(data.users[0]);
                }else{
                    setUserNotfound(true);
                }
            }
        }
        
        const getUserLikedBlogs = async() => {
            const request = await fetch(`/api/v1/writers/${userid}/liked-blogs`, {
                method: "GET"
            })

            if(request.ok){
                const data = await request.json();
                if(data.state == "success"){
                    const Ids = data.blogs_id;
                    const likedBlogs = []
                    for(var id of Ids){
                        const request = await fetch(`/api/v1/blogs/${id}`);
                        if(request.ok){
                            const blogInfo = await request.json();
                            if(blogInfo.state == "success"){
                                likedBlogs.push(blogInfo.content);
                            }
                            
                        }
                    };
                    setUserLikedBlogs(likedBlogs);
                }
            } 
        }

        getUserInfo();
        getUserLikedBlogs();
    }, []);

    return(
        <>  
            <img id="BlogsPage-back" src="/statics/img/back.png" onClick={() => {navigate("/")}}></img>
            {userNotfound == true && 
                <div id="no-blog">
                     <p>User not found</p>
                </div>
            }
            {userInfo &&
                <div id="upper-info"> 
                    <img id="liked-writer-pic" src={userInfo.profilePic}></img>
                    <h1 id="liked-writer-username">{userInfo.username}</h1>
                    <img id="liked-send-message" onClick={() => {navigate('/myaccount/dashboard/#messages:' + userInfo.username)}} src="/statics/img/send.png"></img>
                    <p id="writer-jointDate">Since at {getM_Y(Number(userInfo.joinDate))}</p>
                    <p id="liked-writer-Blogs-text" onClick={() => {navigate(`/writer/${userid}`)}}>Blogs</p>
                    <p id="liked-writer-About-text" onClick={() => {navigate(`/writer/${userid}/about`)}}>About</p>
                    <p id="liked-writer-liked-blogs-text" onClick={() => {navigate(`/writer/${userid}/liked`)}}>Liked</p>
                    <hr id="liked-writer-hr"></hr>
                </div>
            }

            {userLikedBlogs && userLikedBlogs.length > 0 && 
            
                <>
                    {userLikedBlogs.map((blog) => (
                    <div className='writer-MainPage-blogs' onClick={() => {navigate(`/blogs/${blog.blog_id}`)}}>
                        <h1 className='writer-MainPage-blogs-title'>{ blog.blog_title.length <= 28 ? blog.blog_title : (blog.blog_title.substring(0, 28) + "...")}</h1>
                        <div className='writer-MainPage-blogs-image-container'>
                            <img src={blog.blog_thumbnail}></img>
                        </div>
                        <p className='writer-MainPage-blogs-summary'>{blog.blog_content.substring(0,200)}</p>
                        <p id="writer-MainPage-blogs-createdAt">{formatDate(Number(blog.createdAt))}</p>
                        <p id='writer-MainPage-blogs-username'>{blog.user.username}</p>
                        <img id="writer-MainPage-blogs-username-pic" src={blog.user.profilePic}></img>
                        <hr className='writer-MainPage-blogs-end'></hr>                     
                    </div>
                ))}
                </>
            }

            {userLikedBlogs && userLikedBlogs.length == 0 && userNotfound !== true && 
                <div id="no-blog">
                    <p>There is no any blog yet...</p>
                </div>
            }

        </>
    )
}

export default UserProfileLiked;