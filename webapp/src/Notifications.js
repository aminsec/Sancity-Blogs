import React, {useState, useEffect } from 'react'; 
import {useNavigate } from "react-router-dom";
import { checkIsUserLogin } from './Login';
import "./css/Notifications.css";

function Notifications(){
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [notifs, setNotifs] = useState("");
    const [notfisCompleted, setNotifsCompleted] = useState("");
    const [notifcations, setNotfications] = useState("");

    //Checking if user has logged in or not
    useEffect(() => {
        checkIsUserLogin(navigate)
    }, []);

    useEffect(() => {
        //Making a request to seen the notifications
        const seenNotifs = () => {
            fetch("/api/v1/user/notifications", {
                method: "POST",
                credentials: "include"
            })
        }

        const getUserInfo = async () => {
            const req = await fetch("/api/v1/user/info", {
                method: "GET",
                credentials: "include"
            });

            if(req.ok){
                const data = await req.json();
                setUser(data);
            }
        }
        
        seenNotifs();
        getUserInfo();
    }, []);

    useEffect(() => {
        const getNotif = async () => {
            const req = await fetch("/api/v1/user/notifications", {
                method: "GET",
                credentials: "include"
            });

            if(req.ok){
                const data = await req.json();
                if(data.state == "success"){
                    if(data.notifications.length > 0){
                        setNotifs(data.notifications);
                    }else{
                        setNotifs(null)
                    }
                   
                }
            }
        }

        getNotif();
    }, []);

    //Getting notifs user and blog information
    useEffect(() => {
        if(notifs){
            const getNotifsInfo = async () => {
                var notifsToBePush = []
                for(var vals of notifs){
                    var notifUserId = vals.acted_userid;
                    var notifBlogId = vals.blog_id;
                    const getUserInfo =  await fetch(`/api/v1/writers/${notifUserId}`, {
                        method: "GET"
                    });
    
                    if(getUserInfo.ok){
                        const data =  await getUserInfo.json();
                        vals.user = data.users[0];
                        const getBlogInfo = await fetch(`/api/v1/blogs/${notifBlogId}`, {
                            method: "GET"
                        })
                        if(getBlogInfo.ok){
                            const data =  await getBlogInfo.json();
                            //Passing if the blog not found
                            if(data.state == "failed"){
                                continue
                            }
                            vals.blog = data.content;
                            if(vals.comment_id){
                                const getCommentInfo = await fetch(`/api/v1/blogs/${notifBlogId}/comments/${vals.comment_id}`, {
                                    method: "GET"
                                });

                                if(getCommentInfo.ok){
                                    const data = await getCommentInfo.json();
                                    //Passing if the comment not found
                                    if(data.state == "failed"){
                                        continue
                                    }
                                    vals.commentInfo = data.comment;
                                    console.log(vals)
                                }else{
                                    continue
                                }
                            }
                        }else{
                            continue
                        }
                        
                    }else{
                        continue
                    }

                    notifsToBePush.push(vals);
                }
                setNotfications(notifsToBePush);
                
                setNotifsCompleted(true);
            }
            getNotifsInfo();
            
        }

    }, [notifs])

    async function deleteNotif(notifId){
        const request = await fetch(`/api/v1/user/notifications/${notifId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if(request.ok){
            const data = await request.json();
            if(data.state == "success"){
                window.location.reload();
            }
        }
    }

    async function deleteAllNotifs(){
        const request = await fetch(`/api/v1/user/notifications/all`, {
            method: "DELETE",
            credentials: "include"
        });

        if(request.ok){
            const data = await request.json();
            if(data.state == "success"){
                window.location.reload();
            }
        }
    }


    return(
        <>
            <div id="left-panel">
                {user && <img id="profile-image-dashboard" src={user.profilePic}></img>}
                {user && <div id="username-dashboard-div"><h3 id="dashboard-username">{user.username}</h3></div>}
                <img id="dash-pen" src="/statics/img/feather.png" onClick={() => {navigate("/myaccount/new")}}></img>
                <img id="panel-setting" src="/statics/img/setting.png" onClick={() => {navigate("/myaccount/setting")}}></img>
                <li className="panelElements" onClick={() => {navigate("/myaccount/dashboard")}}>Dashboard</li>
                <li className="panelElements" onClick={() => {navigate("/myaccount/favorites")}}>Favorites</li>
                <li className="panelElements" onClick={() => {navigate("/myaccount/likes")}}>Liked Blogs</li>
                <li className="panelElements" id="elements-dashboard" onClick={() => {navigate("/myaccount/notifications")}}>Notifications</li>
                <li className="panelElements" onClick={() => {window.location.href = '/Comming-soon'}}>Tickets</li>
                <li className="panelElements" onClick={() => {navigate("/")}}>Home</li>
                <li className="panelElements" onClick={() => {window.location.href = "/api/v1/auth/logout"}}>Logout</li>
                <button id="new-blog" onClick={() => {navigate("/myaccount/new")}}>New Blog</button>
            </div>
            <h1 id="notif-title">Notifications 🔔</h1>
            <hr id="notif-hr"></hr>
            {notfisCompleted == true && notifcations.length > 0 && 
                <button id="del-all" onClick={deleteAllNotifs}>Delete all</button>
            }
            
            {(notifs == null || notifcations.length == 0) && 
                <>
                    <div id="null-notifs-div">  
                        <h3 id="null-notifs">No news...</h3>
                    </div>
                    
                </>
            }

            {notifs && notfisCompleted == false && 
                <>
                    <div id="preparing-notifs-div">  
                    </div>
                    <h3 id="preparing-notifs">Preparing notifications...</h3>
                </>

            }

            {notfisCompleted == true && notifcations && notifcations.map((notif) => (
                <>
                    <div className='notif-notifs' onClick={() => {
                        if(notif.action_name == "liked_blog"){
                            navigate(`/blogs/${notif.blog_id}`);
                        }else if(notif.action_name == "commented_blog"){
                            navigate(`/blogs/${notif.blog_id}/comments/${notif.comment_id}`);
                        }else if(notif.action_name == "liked_comment"){
                            navigate(`/blogs/${notif.blog_id}/comments/${notif.comment_id}`);
                        }
                    }}>
                        <img src={notif.user.profilePic} className='notif-div-profileIMG' onClick={(e) => {e.stopPropagation();navigate(`/writer/${notif.acted_userid}`)}}></img>
                        <h3 className='notif-div-title'>{notif.notif_title}</h3>
                        <p  className='notif-div-date'>{notif.date}</p>
                       
                        
                        {notif.action_name == "liked_blog" && 
                        <>
                            <p className='notif-div-summury'>{notif.blog.blog_content.length > 150 ? notif.blog.blog_content.substring(0, 150) + "..." : notif.blog.blog_content}</p>
                        </>}
                        
                        {notif.action_name == "liked_comment" && notif.commentInfo && 
                        
                            <p className='notif-div-summury'>{notif.commentInfo.comment_text.length > 50 ? notif.commentInfo.comment_text.substring(0,50) + "..." : notif.commentInfo.comment_text}</p>
                        }

                        {notif.action_name == "commented_blog" && notif.commentInfo && 
                             <p className='notif-div-summury'>{notif.commentInfo.comment_text.length > 50 ? notif.commentInfo.comment_text.substring(0,50) + "..." : notif.commentInfo.comment_text}</p>
                        }       
                    </div>  
                    <img src="/statics/img/del.png" id={notif.id} onClick={() => {deleteNotif(notif.id)}} onMouseOver={() => {document.getElementById(notif.id).src = "/statics/img/delete.png"}} onMouseLeave={() => {document.getElementById(notif.id).src = "/statics/img/del.png"}} className="del-notif"></img>                 
                    <hr className='notif-div-hr'></hr>
                </>
            ))}
        </>
    )
}

export default Notifications;