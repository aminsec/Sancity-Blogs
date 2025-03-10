import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./css/ForgotPassword.css";
import styles from "./css/buttons.module.css";

export default function ForgotPassword(){
    const [updateError, setUpdateError] = useState({});
    const navigate = useNavigate();

    async function changePassword(){
        var email = document.getElementById("forgot-password-input").value;
        var data = {email: email};
        const request = await fetch("/api/v1/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        })
        if(request.ok){

            const data = await request.json();
            if(data.state == "failed"){
                setUpdateError(data);               
            }
        }

    }

    return(
        <>  
            <img src="/statics/img/back.png" id="forgot-password-back" onClick={() => {navigate(-1)}}></img>
            <h1 id="forgot-pass-title">Don't Panic!<br></br>We are here to help</h1>
            <input id="forgot-password-input" placeholder='Enter your email'></input>
            {updateError.state == "failed" &&  <p id="forgot-password-error">{updateError.message}</p>}
            <button id="forgot-password-btn" className={styles.hoverBTN} onClick={changePassword}>Send</button>
            <div id="forgot-password-moreInfo">
                <a><li id="forgot-password-signupBTN" onClick={() => {navigate("/signup")}}>I'm new here</li></a>
                <a><li id="forgot-password-loginBTN"  onClick={() => {navigate("/login")}}>I have account</li></a>
            </div>
        </>
    )
}

