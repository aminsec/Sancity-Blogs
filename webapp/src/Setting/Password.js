import React from 'react';
import LeftPanel from "./Setting"
import { checkIsUserLogin } from '../Login';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/settingPassword.css"

function UpdatePassword(){
    const navigate = useNavigate();
    const [updateMessage, setUpdateMessage] = useState("");
    const [passwordUpdated, setPasswordUpdated] = useState("");
    const [newPassValue, setNewPassValue] = useState("");
    const [oldPassValue, setoldPassValue] = useState("");

    //Checking if user has logged in or not
    useEffect(() => {
        checkIsUserLogin(navigate)
    }, [])

    function changeNewPassValue(event){
        setNewPassValue(event.target.value);
    }

    function changeOldPassValue(event){
        setoldPassValue(event.target.value);
    }

    function updateInfo(){
        const data = {
            newPass: newPassValue,
            oldPass: oldPassValue
        }

        var http = new XMLHttpRequest();
        http.open("PUT", "/api/v1/user/changePassword");
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.send(JSON.stringify(data));

        http.onreadystatechange = () => {
            if(http.readyState == 4){
                var data = JSON.parse(http.responseText)
                if(data.state == "success"){
                    setPasswordUpdated("success");
                    setUpdateMessage(data.message);
                }else{
                    setPasswordUpdated("failed");
                    setUpdateMessage(data.message);
                }
            }
        }
    }

    return(
        
        <div>
            <LeftPanel />
            <img src="/statics/img/back.png" id="password-back" onClick={() => {navigate("/myaccount/dashboard")}}></img>
            {passwordUpdated == "success" && <div id="dataUpdated"><p>{updateMessage}</p></div>}
            {passwordUpdated == "failed" && <div id="dataUpdatedFalse"><p>{updateMessage}</p></div>}
            <h3 id="password-header">Password</h3>
            <input type='password' id="passwordINP" placeholder="Enter your new passowrd..." onChange={changeNewPassValue} value={newPassValue}></input>
            <input type='password' id="current-passwordINP" placeholder="Enter your current passowrd..."  onChange={changeOldPassValue} value={oldPassValue}></input>
            <button id="Password-btnDone" onClick={updateInfo}>Done</button>
        </div>
    )
}

export default UpdatePassword;