import React from 'react';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { animated, useSpring } from '@react-spring/web'
import { checkIsUserLogin } from './Login';
import "./css/Dashboard.css";
import "./css/Chat.css";

function Dashboard(){
    const [userInfo, setUserInfo] = useState();
    const [blogsFailedToLoad, setBlogsFailedToLoad] = useState(false);
    const [userBlogs, setUserBlogs] = useState([]);
    const [showQuestionBox, setQuestionBox] = useState();
    const [blogNumberToBeDelete, setBlogNumberToBeDelete] = useState(null);
    const [openBlogOptionById, setOpenBlogOptionById] = useState();
    const [showCopyLinkBoxAndBlogId, setShowCopyLinkBoxAndBlogId] = useState();
    const [magicLinkBlogId, setMagicLinkBlogId] = useState(null);
    const [magicLinkCreating, setMagicLinkCreating] = useState(true);
    const [magicLink, setMagicLink] = useState();
    const [isChatOpen, setIsChatOpen] = useState(null);
    const [animationStart, setAnimationStart] = useState();
    const [isSearchUsernameOpen, setIsSearchUsernameOpen] = useState(false);
    const [foundUsernamesList, setFoundUsernamesList] = useState([]);
    const [foundUsernamesListOpen, setFoundUsernamesListOpen] = useState(false)
    const [searchedUsername, setSearchedUsername] = useState();
    const [chatContact, setChatContact] = useState();
    const [isPvOpen, setIsPvOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isContactsListOpen, setIsContactsListOpen] = useState();
    const [contactsList, setContactsList] = useState([]);
    const [IsThereAnyUnreedMessage, setIsThereAnyUnreedMessage] = useState(false);
    const [temp, setTemp] = useState();
    const [wss, setWss] = useState();
    const navigate = useNavigate();
    var [unseenNotifs, setUnseenNotifs] = useState(0);
    const url = useLocation();
    const [chatBoxAnimation, api] = useSpring(() => ({})); 
    const [searchUsernameAnimation, searchUsernameAnimationAPI] = useSpring(() => ({})); 
    const scrollableDivRef = useRef(null);


    //Checking if user has logged in or not
    useEffect(() => {
        checkIsUserLogin(navigate);
    }, []);

    useEffect(() => {
        if(url.hash){
            setIsContactsListOpen(false)
            if(url.hash == "#messages"){
                setIsContactsListOpen(true)
                if(isChatOpen === false || isChatOpen === null){
                    setIsChatOpen(true);
                    openChatBox();
                    setAnimationStart(true);
                }

            }else if(url.hash.includes("#messages:")){
                const messageFormat = new RegExp(/^#messages:[a-zA-Z0-9_]+$/);
                if(url.hash.match(messageFormat)){
                    //Extracting username to get its info
                    const extractUsername = async () => {
                        const contact = url.hash.split(":")[1];
                        //Preveting to texting him self
                        if(userInfo){
                            if(contact == userInfo.username){
                                return;
                            }
                        }
                        const contactInfo = await getUserInfo(contact);
                        if(contactInfo){
                            setChatContact(contactInfo);
                            setIsPvOpen(true);
                            setIsChatOpen(true);
                            setAnimationStart(true);
                            seenMessage(contactInfo);
                            // seenMessages(contactInfo);
                            if(isChatOpen === false || isChatOpen === null){
                                openChatBox();
                            }
                        }

                    }
                
                    extractUsername()
                }else{
                    console.log(false)
                }
            }

        }else{
            if(animationStart == true){
                setIsChatOpen(false);
                closeChatBox();
            }
        }
    }, [url]);

    useEffect(() => {
    }, [isPvOpen]);

    useEffect(() => {
        //Getting user's info
        const getUserInfo = async () => {
            const req = await fetch("/api/v1/user/info", {
                method: "GET",
                credentials: "include"
            });
            
            if(req.ok){
                const data = await req.json();
                setUserInfo(data);
            }
        };

        //Getting user's notifications
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
        };

        //Getting blogs info
        const grabData = async () => {
            const req = await fetch("/api/v1/user/blogs", {
                method: "GET",
                credentials: "include"
            })

            if(req.ok){
                const data = await req.json();
                if(data.state == "success"){
                    const sortedBlogs = data.blogs.sort((a, b) => b.createdAt - a.createdAt);
                    setUserBlogs(sortedBlogs);
                    Blogs()
                }else{
                    setBlogsFailedToLoad(true)
                }
            }else{
                setBlogsFailedToLoad(true)
            }
        };


        getNotifations();
        getUserInfo();
        grabData();
    }, []);

    //changing format of dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-GB', options);
    };

    const openChatBox = () => {
        api.start({
            from: { x: "1425px", y: "-15px" },
            to: { x: "1050px", y: "-15px" }
        })
    }

    const closeChatBox = () => {
        api.start({
            from: { x: "1050px", y: "-15px"},
            to: { x: "1425px", y: "-15px" }
        })
    }

    const openSearchUsernameBox = () => {
        setFoundUsernamesListOpen(true)
        setIsSearchUsernameOpen(true)
        searchUsernameAnimationAPI.start({
            from: { y: "600px", x: "20px" },
            to: { y: "500px", x: "20px" }
        })
    }

    const closeSearchUsernameBox = () => {
        setFoundUsernamesListOpen(false)
        searchUsernameAnimationAPI.start({
            from: {  y: "500px", x: "20px" },
            to: { y: "600px", x: "20px" }
        });
        
        setTimeout(() => {
            setIsSearchUsernameOpen(false)
        }, 500);
    }

    async function findUser(username){
        const request = await fetch(`/api/v1/writers/${username}`, {method: "GET"});
        if(request.ok){
            const data = await request.json();
            if(data.state == "success"){
                const response = data.users;
                return response;
            }
        }
    }

    function seenMessage(contactInfo){
        if(userInfo){
            const contactsList = JSON.parse(localStorage.getItem(userInfo.userid));
            if(contactsList[contactInfo.userid]){
                contactsList[contactInfo.userid].seen = true;
                localStorage.setItem(userInfo.userid, JSON.stringify(contactsList))
            }
        }

    }

    async function getUserInfo(username){
        const request = await fetch(`/api/v1/writers/${username}/info`, {method: "GET"});
        if(request.ok){
            const data = await request.json();
            if(data.state == "success"){
                const response = data.user;
                return response;
            }else{
                return null;
            }
        }
    }

    const searchUsername = async (username) => {
        const foundUsernames = await findUser(username);
        setFoundUsernamesList(foundUsernames);
    }

    const sortMessage = (messages) => {
        const sortedMessages = messages.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        return sortedMessages;
    }   

    const updateLocalStorage = (message) => {
        const contactsList = JSON.parse(localStorage.getItem(userInfo.userid));
        if(!(chatContact.userid  in contactsList)){
            //Adding new contact to list
            contactsList[chatContact.userid] = {
                "username": chatContact.username,
                "userid": chatContact.userid,
                "profilePic": chatContact.profilePic,
                "lastMessage": message,
                "seen": true,
            }
            localStorage.setItem(userInfo.userid, JSON.stringify(contactsList))
        }else{
            //Updating existing contact last message
            contactsList[chatContact.userid].lastMessage = message;
            contactsList[chatContact.userid].seen = true;
            localStorage.setItem(userInfo.userid, JSON.stringify(contactsList));
        }
    }


    const updateLocalStorageWhenMessageReceives = async (message) => {
        const messageObj = JSON.parse(message.data);
        const contactInformation = await getUserInfo(messageObj.from)
        const contactsList = JSON.parse(localStorage.getItem(userInfo.userid));
        if(!(contactInformation.userid in contactsList)){
            //Adding new contact to list
            contactsList[contactInformation.userid] = {
                "username": contactInformation.username,
                "userid": contactInformation.userid,
                "profilePic": contactInformation.profilePic,
                "lastMessage": messageObj.message,
                "seen": isPvOpen === true ? true : false
            }
            localStorage.setItem(userInfo.userid, JSON.stringify(contactsList));
        }else{
            //Updating existing contact last message
            contactsList[contactInformation.userid].lastMessage = messageObj.message;
            contactsList[contactInformation.userid].seen = window.location.hash.includes("messages:") === true ? true : false
            localStorage.setItem(userInfo.userid, JSON.stringify(contactsList));
        }

        var contactsInfoList = []
        const clist = JSON.parse(localStorage.getItem(userInfo.userid));
        for(let contactsId in clist){
            contactsInfoList.push(clist[contactsId])
        }
        setContactsList(contactsInfoList);
        setIsThereAnyUnreedMessage(true)
        updateMessage(message);
    }
    
    const sendMessage = () => {
        const message = document.getElementById("message-inp").value;
        const messageValidateREG = new RegExp(/^(\s|\n|\t)+$/);
        if(!message.match(messageValidateREG)){
            const messageToBeSend = {
                message: message,
                to: chatContact.username,
                token: userInfo.token
            }

            wss.send(JSON.stringify(messageToBeSend));
            const messageObj = {
                message: message,
                type: "send",
                timestamp: Date.now()
            }
            
            setMessages([...messages, messageObj]);
        }

        updateLocalStorage(message)
    }

    const updateMessage = (message) => {
        const newMessage = JSON.parse(message.data);
        newMessage.type = "received";
        setMessages(oldArray => [...oldArray, newMessage] );
        if(scrollableDivRef.current){
            scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
        }
    }

    useLayoutEffect(() => {
        if (scrollableDivRef.current) {
          scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
        }
      }, [messages]);

    useEffect(() => {
        //Stabilishing WS when user info loaded
        const connectWss = async () => {
            if(userInfo){
                const socket =  new WebSocket('ws://ws.sancity.blog:8081/chat', [userInfo.token]);  
                socket.onopen = () => {
                    console.log("Connected to WS");
                    setWss(socket);
                }
                socket.onmessage = (message) => {
                    console.log(":::::::::::::::::::::::::", message)
                    updateLocalStorageWhenMessageReceives(message);
                }

                socket.onerror = (error) => {
                    console.log("Error occured in ws connection")
                    console.log(error)
                }

                //Reconnecting when connection closed
                socket.onclose = () => {
                    console.log("WS disconnected")
                    connectWss();
                }
            }
        };

        const checkLocalStorageSetup = () => {
            if(userInfo){
                const accounts = localStorage.getItem(userInfo.userid);
                if(accounts == null){
                    localStorage.setItem(userInfo.userid, JSON.stringify({}))
                }
            }

        }

        const checkIsThereAnyUnreedMessage = () => {
            if(userInfo){
                const contactsList = JSON.parse(localStorage.getItem(userInfo.userid));
                for(let id in contactsList){
                    if(contactsList[id].seen === false){
                        setIsThereAnyUnreedMessage(true)
                    }
                }
            }

        }

        checkIsThereAnyUnreedMessage()

        connectWss();
        checkLocalStorageSetup()
    }, [userInfo]);

    useEffect(() => {
        if(isPvOpen === true){
            const getMessages = async () => {
                const request = await fetch(`/api/v1/user/messages/${chatContact.username}?limit=1000&offset=0`, {
                    method: "GET",
                    credentials: "include"
                });

                if(request.ok){
                    const data = await request.json();
                    if(data.state == "success"){
                        const messages = data.messages;
                        const allMessages = [];
                        for(let vals of messages.sents){
                            vals.type = "send";
                            allMessages.push(vals)
                        }

                        for(let vals of messages.receiveds){
                            vals.type = "received";
                            allMessages.push(vals)
                        }
                        
                        const sortedMessages = sortMessage(allMessages);
                        setMessages(sortedMessages)
                    }
                }
            }

            getMessages();
        }
        
    }, [isPvOpen]);

    useEffect(() => {
        if(isContactsListOpen === true && userInfo){
            var contactsInfoList = []
            const clist = JSON.parse(localStorage.getItem(userInfo.userid));
            for(let contactsId in clist){
                contactsInfoList.push(clist[contactsId])
            }
            setContactsList(contactsInfoList);
        }
    }, [isContactsListOpen, userInfo])

    function deleteBlogRequest(blogId){
        var http = new XMLHttpRequest();
        http.open("DELETE", `/api/v1/user/blogs/${blogId}`);
        http.withCredentials = true;
        http.send();

        http.onreadystatechange = function(){
            if(http.readyState == 4 && http.status == 200){
                var data = JSON.parse(http.responseText);
                if(data.state == "success"){
                    window.location.reload();
                }
            }
        }
    };

    async function createMagicLink(blogId){
        const request = await fetch(`/api/v1/user/blogs/${blogId}/magicLink`, {
            method: "POST",
            credentials: "include"
        });
        if(request.ok){
            const data = await request.json();
            if(data.state == "success"){
                setMagicLinkCreating(false);
                setMagicLink(data.magicLink);
            }
        }
    };
    
    function Blogs(){
        if(userBlogs.length > 0 && userInfo){
            return(
                <>
                    {userBlogs.map((blog) => (
                        <div className='blogs'>
                            <img className="blogs-blog-options-icon" onClick={() => {if(openBlogOptionById == blog.blog_id){setOpenBlogOptionById(null)}else{setOpenBlogOptionById(blog.blog_id)}}} src="/statics/img/menu.png"></img>
                            {openBlogOptionById == blog.blog_id && 
                                <div className='blogs-blogs-options-div'>
                                    <button onClick={() => {
                                        setShowCopyLinkBoxAndBlogId(blog.blog_id); 
                                        setOpenBlogOptionById(null); 
                                        if(blog.is_public == 0){
                                            setMagicLinkBlogId(blog.blog_id);
                                            createMagicLink(blog.blog_id);
                                        }
                                    }} id="blogs-magic-link">{blog.is_public == 1 ? "Share by link" : "Share by magic link"}</button>
                                </div>
                            }
                            <h1 className='blogs-title'>{ blog.blog_title.length <= 28 ? blog.blog_title : (blog.blog_title.substring(0, 28) + "...")}</h1>
                            <div className='blogs-blog-image-container'>
                                <img src={blog.blog_thumbnail}></img>
                            </div>
                            <p className='blogs-summary'>{blog.blog_content.substring(0,200) + "..."}</p>
                            <button id="blogs-preview-btn" onClick={() => {navigate(`/myaccount/blogs/${blog.blog_id}`)}}>Preview</button>
                            <button id="blogs-edit-btn" onClick={() => {navigate(`/myaccount/blogs/${blog.blog_id}/edit`)}}>Edit</button>
                            <button id="blogs-delete-btn" onClick={() => {setQuestionBox(true); setBlogNumberToBeDelete(blog.blog_id)}}>Delete</button>
                            <p id="dash-blogs-createdAt">{formatDate(Number(blog.createdAt))}</p>
                            <p id='blogs-username'>{userInfo.username}</p>
                            <img id="blogs-username-pic" src={userInfo.profilePic}></img>
                            {blog.is_public == 1 && <div id="isPublicblog"><p id="isPublicText">&nbsp;Public</p></div>}
                            {blog.is_public == 0 && <div id="isPublicblog" style={{backgroundColor: "rgb(255, 150, 150)"}}><p id="isPublicText">Private</p></div>}
                            <hr className='blogs-end'></hr>          
                        </div>
                    ))}
                </>
            )


        }else{
            return(
                <div id="noBlogs"><p>You don't have any blog yet</p></div>
            )
        }
    };

    function Chat(){
        return(
            <animated.div id="chat-container" style={{...chatBoxAnimation}}>
                <div id="chat-handle"   onClick={() => {
                        if (isChatOpen === false || isChatOpen === null) {
                        setAnimationStart(true);
                        navigate("#messages");
                        } else {
                        navigate("/myaccount/dashboard");
                        }
                    }}>
                    <p id="chat-handle-text">Messages</p>
                    {IsThereAnyUnreedMessage === true && 
                     <div id="unseen-dot"></div>
                    }
                </div>
                <h1 id="chat-header-text">Messages</h1>

                <div id="search-username-btn" onClick={() => {isSearchUsernameOpen === true ? closeSearchUsernameBox() : openSearchUsernameBox()}}>
                    <img id="search-username-btn-img" src="/statics/img/sparkle.png"></img>
                </div>

                
                {foundUsernamesList && foundUsernamesList.length > 0 && foundUsernamesListOpen === true && 
                    <div id="found-usernames-container">
                        {foundUsernamesList.map((user) => (
                            <>
                                <div className='found-user-div' onClick={() => {setSearchedUsername(null); setFoundUsernamesList(null); navigate(`/myaccount/dashboard#messages:${user.username}`)}}>
                                    <img className='found-user-profile' src={user.profilePic}></img>
                                    <h3 className='found-user-username'>{user.username}</h3>
                                </div>
                               
                            </>
                        ))}
                    </div>
                }
                {isSearchUsernameOpen === true && 
                    <animated.input id="search-username-inp" autoFocus value={searchedUsername} onChange={value => {searchUsername(value.target.value); setSearchedUsername(value.target.value)}} style={{...searchUsernameAnimation}} placeholder='Search by username...'></animated.input>
                }

                {isPvOpen === true && chatContact && 
                    <>
                        <div className='pv-container'>
                            <img id="close-pv" src="/statics/img/close.png" onClick={() => {setMessages([]); setChatContact(null); setIsPvOpen(false);navigate("#messages");}}></img>
                            <img id="contact-profile" onClick={() => {navigate(`/writer/${chatContact.userid}`)}} src={chatContact.profilePic}></img>
                            <h2 id="contact-username"  onClick={() => {navigate(`/writer/${chatContact.userid}`)}}>{chatContact.username}</h2>
                            <hr id="pv-hr"></hr>
                            <div id="messages-container" ref={scrollableDivRef}>
                                {messages && messages.filter((message) => (message.from === chatContact.username ||  message.sender === chatContact.username || message.sender === userInfo.username || message.type === "send")).map((message) => (
                                    <div>
                                        {message.type == "send" && 
                                            <div className="send-message">
                                                <p className="send-message-text">{message.message}</p>
                                            </div>
                                        }
                                        {message.type == "received" && 
                                            <div className="received-message">
                                                <p className="received-message-text">{message.message}</p>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>
                            <textarea id="message-inp" placeholder={`Send something to ${chatContact.username}...`}></textarea>
                            <button id="send-message-btn" onClick={sendMessage}>
                                <img id="send-message-img" src="/statics/img/sendMessage.png"></img>
                            </button>
                        </div>
                    </>
                }

                {contactsList && contactsList.length > 0 &&
                    <>

                        {contactsList.filter((contact) => {if(contact.seen === false){return contact}}).map((contact) => (
                            <div className='contact' onClick={() => {setChatContact(contact); setIsPvOpen(true); navigate(`/myaccount/dashboard#messages:${contact.username}`)}}>
                                <img className='contact-profilePic' src={contact.profilePic}></img>
                                <h2 className='contact-username'>{contact.username}</h2>
                                <p className='contact-lastMessage' style={{color: "white"}}>{contact.lastMessage.length > 30 ? contact.lastMessage.substr(0, 30) + "..." : contact.lastMessage}</p>
                                <div className='contact-unseen-icon'></div>
                            </div>
                        ))}                        
                        {contactsList.filter((contact) => {if(contact.seen === true){return contact}}).map((contact) => (
                            <div className='contact' onClick={() => {setChatContact(contact); setIsPvOpen(true); navigate(`/myaccount/dashboard#messages:${contact.username}`)}}>
                                <img className='contact-profilePic' src={contact.profilePic}></img>
                                <h2 className='contact-username'>{contact.username}</h2>
                                <p className='contact-lastMessage'>{contact.lastMessage.length > 30 ? contact.lastMessage.substr(0, 30) + "..." : contact.lastMessage}</p>
                            </div>
                        ))} 
                    </>
                }
            </animated.div>
        )
    }

    return(
        <>
        <Chat />
        <h1 id="titles">Blogs</h1>
        <hr id="line"></hr>
        <Blogs />
        {blogsFailedToLoad ? <div id="blogAddFailed"><p>Coulnd't get data :(</p></div>: null}

        {userInfo && <div id="left-panel">
            <img id="profile-image-dashboard" src={userInfo.profilePic}></img>
            <div id="username-dashboard-div"><h3 id="dashboard-username">{userInfo.username}</h3></div>
            <img id="dash-pen" src="/statics/img/feather.png" onClick={() => {navigate("/myaccount/new")}}></img>
            <img id="panel-setting" src="/statics/img/setting.png" onClick={() => {navigate("/myaccount/setting")}}></img>
            <li className="panelElements" id="elements-dashboard" onClick={() => {navigate("/myaccount/dashboard")}}>Dashboard</li>
            <li className="panelElements" onClick={() => {navigate("/myaccount/favorites")}}>Favorites</li>
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
        </div>}
        {showQuestionBox == true && 
            <div>
                <div id="wall"></div>
                <div id="question-box">
                    <h3>Are you sure you want to delete this blog?</h3>
                    <button id="cancelDLT" onClick={() => {setQuestionBox(false)}}>Nah</button>
                    <button id="DLT" onClick={() => {setQuestionBox(false); deleteBlogRequest(blogNumberToBeDelete)}}>Yeah</button>                    
                </div>
            </div>
        }
        {showCopyLinkBoxAndBlogId && 
            <div>
                <div id="wall"></div>
                <div id="question-box2">
                    {magicLinkBlogId == null && 
                        <>
                            <h3>You can use this link to share your blog with friends!</h3>
                            <input readOnly id="blogLink" value={window.origin + "/blogs/" + showCopyLinkBoxAndBlogId}/>  <br></br><br></br>
                            <button id="copyBLogLink" onClick={async () => {
                            document.getElementById("blogLink").select();
                            document.execCommand("copy");
                            setShowCopyLinkBoxAndBlogId(null);
                            }}>Copy</button>   
                        </>
                    }
                    {magicLinkBlogId != null && 
                        <>
                            <h3>Use this magic link to share your private blog with friends!</h3>
                            <input readOnly value={magicLink ? magicLink : ""} id="blogLink" placeholder={magicLinkCreating == true ? "Magic link is creating..." : null}/>  <br></br><br></br>
                            <button id="copyBLogLink" disabled={magicLinkCreating ? true : null} style={{backgroundColor: magicLinkCreating ? "gray" : null}} onClick={async () => {
                            document.getElementById("blogLink").select();
                            document.execCommand("copy");
                            setShowCopyLinkBoxAndBlogId(null);
                            }}>Copy</button>   
                            <p id="magicLink-expires">Expires in 5 minutes</p>
                        </>
                    }
                </div>
            </div>
        }
        </>
    )
}

export default Dashboard;