import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../css/Profile.css"

function UserProfile(){
    const { userid } = useParams();
    const [userInfo, setUserInfo] = useState();
    const [userBlogs, setUserBlogs] = useState();
    const [userNotfound, setUserNotfound] = useState();
    const [isSelfProfile, setIsSelfProfile] = useState();
    const navigate = useNavigate();

    //changing format of dates
    const getM_Y = (timestamp) => {
        const date = new Date(timestamp).toDateString(); // e.g output: 'Wed Apr 16 2014'
        const dates = date.split(' '); // seprating 
        const month = dates[1];
        const year  = dates[3];

        return month + " " + year;
    }; 

    //changing format of dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-GB', options);
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
        
        const getUserBlogs = async() => {
            const request = await fetch(`/api/v1/writers/${userid}/blogs`, {
                method: "GET"
            })

            if(request.ok){
                const data = await request.json();
                if(data.state == "success"){
                    const sortedBlogs = data.content.sort((a, b) => b.createdAt - a.createdAt);
                    setUserBlogs(sortedBlogs);
                }
            } 
        }

        getUserInfo();
        getUserBlogs();
        
    }, []);

    useEffect(() => {
        const checkIsSelfProfile = async () => {
            const request = await fetch(`/api/v1/user/info`, {
                method: "GET",
                credentials: "include"
            });
            
    
            if(request.status === 200){
                try {
                    var data = await request.json();
                } catch (error) {
                    setIsSelfProfile(false);
                    return
                }
               
                if(data){
                    if(userInfo){
                        if(userInfo.username == data.username){
                            setIsSelfProfile(true);
                        }else{
                            setIsSelfProfile(false);
                        }
                    }
                }
            }
        }

        checkIsSelfProfile();

    }, [userInfo]);

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
                    <img id="writer-pic" src={userInfo.profilePic}></img>
                    <h1 id="writer-username">{userInfo.username}</h1>
                    {isSelfProfile === false && 
                        <img id="liked-send-message" onClick={() => {navigate('/myaccount/dashboard/#messages:' + userInfo.username)}} src="/statics/img/send.png"></img>
                    }
                    <p id="writer-jointDate">Since at {getM_Y(Number(userInfo.joinDate))}</p>
                    <p id="writer-Blogs-text" onClick={() => {navigate(`/writer/${userid}`)}}>Blogs</p>
                    <p id="writer-About-text" onClick={() => {navigate(`/writer/${userid}/about`)}}>About</p>
                    <p id="writer-liked-blogs-text" onClick={() => {navigate(`/writer/${userid}/liked`)}}>Liked</p>
                    <hr id="writer-hr"></hr>
                </div>
            }

            {userInfo && userBlogs && userBlogs.length > 0 && 
            <>
                {userBlogs.map((blog) => (
                    <div className='writer-MainPage-blogs' onClick={() => {navigate(`/blogs/${blog.blog_id}`)}}>
                        <h1 className='writer-MainPage-blogs-title'>{ blog.blog_title.length <= 28 ? blog.blog_title : (blog.blog_title.substring(0, 28) + "...")}</h1>
                        <div className='writer-MainPage-blogs-image-container'>
                            <img src={blog.blog_thumbnail}></img>
                        </div>
                        <p className='writer-MainPage-blogs-summary'>{blog.blog_content.substring(0,200)}</p>
                        <p id="writer-MainPage-blogs-createdAt">{formatDate(Number(blog.createdAt))}</p>
                        <p id='writer-MainPage-blogs-username'>{userInfo.username}</p>
                        <img id="writer-MainPage-blogs-username-pic" src={userInfo.profilePic}></img>
                        <hr className='writer-MainPage-blogs-end'></hr>                     
                    </div>
                ))}
            </>
            }

            {userBlogs && userBlogs.length == 0 && userNotfound !== true && 
                <div id="no-blog">
                    <p>There is no any blog yet...</p>
                </div>
            }
        </>
    )

}

export default UserProfile;
