import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { checkIsUserLogin } from './Login';
import "./css/Favorites.css";

function Favorites(){
    const [user, setUser] = useState("");
    const [zeroBlog, setZeroBLog] = useState();
    const [blogsFailedToLoad, setBlogsFailedToLoad] = useState(false);
    const [userBlogs, setUserBlogs] = useState([]);
    var [unseenNotifs, setUnseenNotifs] = useState(0);
    const navigate = useNavigate();

    //Checking if user has logged in or not
    useEffect(() => {
        checkIsUserLogin(navigate)
    }, []);

    //changing format of dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-GB', options);
        };

    useEffect(() => {
        const grabData = async () => {
            const req = await fetch("/api/v1/user/favorites", {
                method: "GET",
                credentials: "include"
            })

            if(req.ok){
                const data = await req.json();
                if(data.state == "success"){
                    var blogs_id = data.blogs_id;
                    for(let id of blogs_id){
                        const req = await fetch(`/api/v1/blogs/${id}`);
                        if(req.ok){
                            const blogInfo = await req.json();
                            if(blogInfo.state == "success"){
                                setUserBlogs((prevValues) => [...prevValues, blogInfo.content]);
                            }
                        }
                    }
                }else{
                    setZeroBLog(true);
                }
            }else{
                setBlogsFailedToLoad(true)
            }
        }
        const grabUserData = async () => {
            const req = await fetch("/api/v1/user/info", {
                method: "GET",
                credentials: "include"
            })

            if(req.ok){
                const data = await req.json();
                setUser(data);
            }
        }
        grabData();
        grabUserData();
    }, []);

    useEffect(() => {
        const getNotifations = async () => {
            const req = await fetch("/api/v1/user/notifications", {
                method: "GET",
                credentials: "include"
            })

            if(req.ok){
                const data = await req.json();
                if(data.state == "success"){
                    const notifications = data.notifications;
                    for(var index = 0; index < notifications.length; index ++){
                        if(notifications[index].seen == 0){
                            unseenNotifs += 1;
                            setUnseenNotifs(unseenNotifs);
                        }
                    }
                }
            }
        }
        getNotifations();
    }, []);

    function Blogs(){
        if(userBlogs.length > 0){
            return(
                <>
                    {userBlogs.map((blog) => (
                        <div className='blogsFav' onClick={() => {navigate(blog.is_public == 1? `/blogs/${blog.blog_id}`: `/myaccount/blogs/${blog.blog_id}`)}}>
                            <h1 className='blogs-title'>{ blog.blog_title.length <= 28 ? blog.blog_title : (blog.blog_title.substring(0, 28) + "...")}</h1>
                            <div className='blogs-image-container'>
                                <img src={blog.blog_thumbnail}></img>
                            </div>
                            <p className='blogs-summary'>{blog.blog_content.substring(0,200) + "..."}</p>
                            <p id="blogs-createdAt">{formatDate(Number(blog.createdAt))}</p>
                            <p id='blogs-username'><a className='favs-blogs-username-a' href={`/writer/${blog.user.userid}`} onClick={(e) => {e.stopPropagation()}}>{blog.user.username}</a></p>
                            <img id="blogs-username-pic"  onClick={(e) => {e.stopPropagation(); navigate(`/writer/${blog.user.userid}`)}} src={blog.user.profilePic}></img>
                            <hr className='blogs-end'></hr>          
                        </div>
                    ))}
                </>
            )

        }else{
            return(
                <div id="noBlogs"><p>You have not saved anything yet</p></div>
            )
        }
    }
    return(
        <>
        <h1 id="titles">Saved Blogs 📌</h1>
        <hr id="line"></hr>
        <Blogs />
        {blogsFailedToLoad ? <div id="blogAddFailed"><p>Coulnd't get data :(</p></div>: null}

        <div id="left-panel">
            <img id="profile-image-dashboard" src={user.profilePic}></img>
            {user && <div id="username-dashboard-div"><h3 id="dashboard-username">{user.username}</h3></div>}
            <img id="pen" src="/statics/img/feather.png" onClick={() => {navigate("/myaccount/new")}}></img>
            <img id="fav-setting" src="/statics/img/setting.png" onClick={() => {navigate("/myaccount/setting")}}></img>
            <li className="panelElements" onClick={() => {navigate("/myaccount/dashboard")}}>Dashboard</li>
            <li className="panelElements" id="elements-favorites" onClick={() => {navigate("/myaccount/favorites")}}>Favorites</li>
            <li className="panelElements" onClick={() => {navigate("/myaccount/likes")}}>Liked Blogs</li>
            <li className="panelElements" onClick={() => {navigate("/myaccount/notifications")}}>Notifications</li>
            {unseenNotifs > 0 && 
                <div onClick={() => {navigate("/myaccount/notifications")}} id="unseenNotifsCount-div">
                    <p id="unseenNotifsCount">{unseenNotifs}</p>
                </div>
            }
            <li className="panelElements" onClick={() => {window.location.href = '/Comming-soon'}}>Tickets</li>
            <li className="panelElements" onClick={() => {navigate("/")}}>Home</li>
            <li className="panelElements" onClick={() => {window.location.href = "/api/v1/auth/logout"}}>Logout</li>
            <button id="new-blog" onClick={() => {navigate("/myaccount/new")}}>New Blog</button>
        </div>
        </>
    )
}

export default Favorites