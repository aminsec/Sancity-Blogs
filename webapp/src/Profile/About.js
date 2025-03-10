import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../css/Profile-about.css";

//changing format of dates
const getM_Y = (timestamp) => {
    const date = new Date(timestamp).toDateString(); // e.g output: 'Wed Apr 16 2014'
    const dates = date.split(' '); // seprating 
    const month = dates[1];
    const year  = dates[3];

    return month + " " + year;
}; 

function About(){
    const { userid } = useParams();
    const [UserInfo, setUserInfo] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const getUserBio = async ()=>{
            const request = await fetch(`/api/v1/writers/${userid}`, {method: "GET"});
            if(request.ok){
                const UserData = await request.json();
                if(UserData.state == "success"){
                    setUserInfo(UserData.users[0]);
                }
            }
        }

        getUserBio();
    }, [])

    return(
        <>
            <img id="BlogsPage-back" src="/statics/img/back.png" onClick={() => {navigate("/")}}></img>
            {UserInfo &&
            <>
                <div id="upper-info"> 
                    <img id="liked-writer-pic" src={UserInfo.profilePic}></img>
                    <h1 id="liked-writer-username">{UserInfo.username}</h1>
                    <img id="liked-send-message" onClick={() => {navigate('/myaccount/dashboard/#messages:' + UserInfo.username)}} src="/statics/img/send.png"></img>
                    <p id="writer-jointDate">Since at {getM_Y(Number(UserInfo.joinDate))}</p>
                    <p id="liked-writer-Blogs-text" onClick={() => {navigate(`/writer/${userid}`)}}>Blogs</p>
                    <p id="about-liked-writer-About-text" onClick={() => {navigate(`/writer/${userid}/about`)}}>About</p>
                    <p id="about-liked-writer-liked-blogs-text" onClick={() => {navigate(`/writer/${userid}/liked`)}}>Liked</p>
                    <hr id="liked-writer-hr"></hr>
                </div>

                <div id="about-bio-div">
                    <h3 id="about-writer-about">{UserInfo.bio}</h3>
                    <hr id="about-bio-hr"></hr>
                </div>
            </>
            }
        </>
    )
}

export default About;