import React from 'react';
import { useEffect, useState } from "react";
import { checkIsUserLogin } from '../Login';
import "../css/settingAccount.css";
import LeftPanel from "./Setting"
import { useNavigate } from "react-router-dom";


function SettingAccount(){
    const [userData, setUserData] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");
    const [dataUpdated, setdataUpdated] = useState("pending");
    const [usernameInputvalue, setusernameInputvalue] = useState("");
    const [emailInputvalue, setemailInputvalue] = useState("");
    const [bioInputValue, setBioInputValue] = useState();
    const [showConfirmBoxToDeleteAccount, setShowConfirmBoxToDeleteAccount] = useState(false);
    const [showPasswordConfirmBoxToDeleteAccount, setShowPasswordConfirmBoxToDeleteAccount] = useState(false);
    const [deleteAccountErr, setDeleteAccountErr] = useState(true);
    const navigate = useNavigate();

    //Checking if user has logged in or not
    useEffect(() => {
        checkIsUserLogin(navigate)
    }, [])

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch("/api/v1/user/info", {
                    method: "GET",
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();
                    setusernameInputvalue(data.username);
                    setemailInputvalue(data.email);
                    if(data.bio == null || data.bio.length == 0){
                        setBioInputValue(" ")
                    }else{
                        setBioInputValue(data.bio)
                    }
                    
                    setUserData(data)
                } else {
                    console.log("Invalid session");
                }
            } catch (error) {
                console.log("Error fetching user data", error);
            }
        }

        fetchUserData();
    }, []);

    async function updateInfo(){
        const username = document.getElementById("newUsernameINP").value;
        const email = document.getElementById("emailINP").value;
        const bio = document.getElementById("bio-textarea").value;

        const data = {
            username: username,
            email: email,
            bio: bio
        }

        const updateReq = await fetch(`/api/v1/user/updateInfo`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if(updateReq.ok){
            const resp = await updateReq.json();
            if(resp.state == "success"){
                setdataUpdated("success");
                setUpdateMessage(resp.message);
            }else{
                setdataUpdated("failed");
                setUpdateMessage(resp.message);
            }
        }else{
            const resp = await updateReq.json();
            setdataUpdated("failed");
            setUpdateMessage(resp.message);
        }
        window.scrollTo(0, 0);
    }

    function changeUsernameValue(event){
        setusernameInputvalue(event.target.value);
    }
    function changeEmailValue(event){  
        setemailInputvalue(event.target.value);
    }     
     
    async function handleProfilePic(e){
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const formData = new FormData();
            formData.append('profilePic', selectedFile);
      
            try {
              const response = await fetch('/api/v1/user/upload', {
                method: 'POST',
                body: formData,
              });
      
              if (response.ok) {
                // Handle success 
                window.location.reload();
              } else {
                // Handle errors
                window.location.reload();
              }
            } catch (error) {
              console.error('An error occurred during file upload:', error);
            }
        }
    }

    async function deleteAccountReq(){
        var passwd = document.getElementById("confirm-passwd-box").value;
        var confirmPasswd = document.getElementById("confirm-passwd-box2").value;
        var body = {
            password: passwd,
            confirm_password: confirmPasswd
        };
        const reqBody = JSON.stringify(body);
        const request = await fetch("/api/v1/user/deleteAccount", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: reqBody
        });
        if(request.redirected){
            window.location.href = request.url;
        }else{
            const data = await request.json();
            setDeleteAccountErr(data.message);
        }
    }

    return(
        <div>
            <LeftPanel />
            <img src="/statics/img/back.png" id="setting-back" onClick={() => {navigate("/myaccount/dashboard")}}></img>
            {dataUpdated == "success" && <div id="dataUpdated"><p>{updateMessage}</p></div>}
            { dataUpdated == "failed" && <div id="dataUpdatedFalse"><p>{updateMessage}</p></div>}
            <img id="profile-image-setting" src={userData.profilePic}></img>
            <input id="change-profile-pic-btn" type='file' onChange={handleProfilePic}></input>
            <h3 id="username">{userData.username}</h3>
            <h3 id="username-header">Username</h3>
            <input id="newUsernameINP" placeholder="Enter your new username..." value={usernameInputvalue} onChange={changeUsernameValue} type="text"></input>
            <h3 id="email-header">Email</h3>
            <input id="emailINP" placeholder="Enter your new email" value={emailInputvalue} onChange={changeEmailValue} type="email"></input>
            <h3 id="bio-header">Bio</h3>
            {bioInputValue &&  <textarea id="bio-textarea" placeholder='Write something about yourself...'>{bioInputValue}</textarea>}
            <button id="btnDone" onClick={updateInfo}>Update</button>
            <h1 id="sensitive-area-title">Sensitive Area</h1>
            <div id="sensitive-area-div" style={{
                position: "absolute",
                borderColor: "red",
                borderStyle: "solid",
                borderWidth: "100%",
                borderRadius: "20px",
                height: "130px",
                width: "1010px",
                left: "350px",
                top: "750px"
                }}>
                <p id="delete-account-info">By deleting your account, all data in this account (blogs, comments, likes and ... )<br></br> will be lost</p>
                <button id="delete-account-btn" onClick={() => {setShowConfirmBoxToDeleteAccount(true)}}>Delete Account</button>
            </div>

            {showConfirmBoxToDeleteAccount == true && 
            <>
                <div id="wall">
                </div>
                <div id="confirm-to-delete-account-box">
                    <p id="confirm-to-delete-account-text">Are you sure you want to delete account?</p>
                    <button id="confirm-to-cancel-account-btn" onClick={() => {setShowConfirmBoxToDeleteAccount(false)}}>Go Back</button>
                    <button id="confirm-to-delete-account-btn" onClick={() => {setShowConfirmBoxToDeleteAccount(false);setShowPasswordConfirmBoxToDeleteAccount(true)}}>Delete Account</button>
                </div>
            </>
            }

            {showPasswordConfirmBoxToDeleteAccount == true && 
            <>
                <div id="wall"></div>
                <div id="confirm-passwd-to-delete-account">
                    <img id="close-confrim-passwd" src="/statics/img/reject.png" onClick={() => {setShowPasswordConfirmBoxToDeleteAccount(false)}}></img>
                    <p id="confirm-passwd-account-text">Confirm your password</p>
                    <input type='password' id="confirm-passwd-box" placeholder='Enter account password...'></input>
                    <input type='password' id="confirm-passwd-box2" placeholder='Confirm account password...'></input>
                    {deleteAccountErr && <p id="deleteAccountErr">{deleteAccountErr}</p>}
                    
                    <button id="final-delete-account-btn" onClick={deleteAccountReq}>Delete Account</button>
                </div>
            </>
            
            }
        </div>


    )
}

export default SettingAccount