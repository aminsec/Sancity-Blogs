import React from 'react';
import { useEffect } from 'react';
import { checkIsUserLogin } from '../Login';
import "../css/Setting.css"
import { useNavigate } from "react-router-dom";

function Setting(){
    const navigate = useNavigate();
    //Checking if user has logged in or not
    useEffect(() => {
        checkIsUserLogin(navigate)
    }, [])
    return(
        <>
        <div id="left-panel">
            <button className="panelArg" onClick={() => {navigate("/myaccount/setting/account")}}>Account</button>
            <button className="panelArg" onClick={() => {navigate("/myaccount/setting/password")}}>Password</button>
            <button className="panelArg" onClick={() => {navigate("/Comming-soon")}}>OAuth</button>
        </div>
        </>
    )
}

export default Setting;