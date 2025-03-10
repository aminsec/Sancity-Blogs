import { useNavigate } from "react-router-dom";
import React from "react";
import { useState, useEffect } from 'react';
import { checkIsUserLogin } from "./Login";
import styles from "./css/buttons.module.css"
import "./css/Signup.css"

function Signup(){
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();
  
  //Checking if user has logged in or not
  useEffect(() => {
    checkIsUserLogin(navigate)
  }, [])

  const sendReq = async () => {
      var username = document.getElementById("usernameInp").value;
      var password = document.getElementById("passwordInp").value;
      var email = document.getElementById("emailInp").value;
  
      const userData = {username: username, password : password, email: email};

      try {
        const request = await fetch('/api/v1/auth/signup', {
          method: "POST",
          credentials: "include",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(userData)
        });

        if(request.status == 200){
          try {
            var queries = window.location.search
            var params = new URLSearchParams(queries);
            if(params.get("redir")){
              var fullURL = window.location.origin + '/' + params.get('redir');
              var url = new URL(fullURL);
              if(url.hostname == 'sancity.blog'){
                console.log("3")
                window.location.href = fullURL;
                return;
              }else{
                navigate('/myaccount/dashboard');
                return
              }
            }else{
              navigate('/myaccount/dashboard');
              return
            }
          } catch (error) {
            navigate('/myaccount/dashboard')
          }
        }else{
          const response = await request.json();
          setErrorMessage(response.message);
          return
        }}catch (error) {
          setErrorMessage("An error occurred. Please try again later.");
        }
      };
  
  return(
    <div id="LoginBox">
      <h1 id="Welcome">Enjoy!<br></br>With Sancity Blogs</h1>
      <input type='email' placeholder='Email' id="emailInp"></input>
      <input type='text' placeholder='Username' id="usernameInp"></input>
      <input type='password' placeholder='Password' id="passwordInp"></input>
      {errorMessage && <p id="error-mssg-signup">{errorMessage}</p>}
      <button id="submitInp" onClick={sendReq} className={styles.hoverBTN}>Create</button>
      <div id="moreInfo">
        <a><li id="signupBTN" onClick={() => {navigate("/login")}}>I have account</li></a>
        <a><li id="forgotpassBTN"  onClick={() => {navigate("/forgot-password")}}>I forgot my password</li></a>
      </div>
      <img src="/statics/img/back.png" id="back-home" onClick={() => {navigate("/")}}></img>
    </div>
  )
}

export default Signup;