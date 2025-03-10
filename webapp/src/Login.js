import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import "./css/Login.css";
import styles from "./css/buttons.module.css";

export async function checkIsUserLogin(nav){
  const checkAuth = async () => {
    const req = await fetch("/api/v1/auth/check-auth", {
      method: "GET",
      credentials: "include"
    });

    if(req.ok){
      const data = await req.json();
      if(data.message === true){
        if(window.location.pathname == "/login" || window.location.pathname == "/signup"){
          nav("/myaccount/dashboard");
        }
      }
      if(data.message === false){
        if(window.location.pathname !== "/signup"){
          nav("/login" + window.location.search);
        }
      }
    }
  }
  await checkAuth();
}

function Login() {
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();
  //Checking if user has logged in or not
  useEffect(() => {
    checkIsUserLogin(navigate)
  }, [])

  const sendReq = async () => {
    var username = document.getElementById("usernameInp").value;
    var password = document.getElementById("passwordInp").value;

    const userData = {username: username, password : password};
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (res.status !== 200) {
        setErrorMessage("Invalid Credentials");
      } else {
        // Navigate to another page on successful login
        var url = new URLSearchParams(window.location.search);
        if(url.get("redir")){
          var fullURL = "http://sancity.blog:8081/" + url.get("redir")
          var URLParts = new URL(fullURL);
          if(URLParts.hostname == "sancity.blog"){
            window.location.href = fullURL;
          }else{
            navigate("/myaccount/dashboard");
          }
        }else{
          navigate("/myaccount/dashboard");
          return;
        }

      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div id="LoginBox">
      <h1 id="Welcome">Welcome Back</h1>
      <input type='text' placeholder='Username' id="usernameInp"></input>
      <input type='password' placeholder='Password' id="passwordInp"></input>
      <button id="submitInp" onClick={sendReq} className={styles.hoverBTN}>Login</button>
      {errorMessage && <p id="error-mssg-login">{errorMessage}</p>}
      <div id="moreInfo">
        <a><li id="signupBTN" onClick={() => {navigate("/signup")}}>I'm new here</li></a>
        <a><li id="forgotpassBTN"  onClick={() => {navigate("/forgot-password")}}>I forgot my password</li></a>
      </div>
      <img src="/statics/img/back.png" id="back-home" onClick={() => {navigate("/")}}></img>
    </div>
  );
}

export default Login;
