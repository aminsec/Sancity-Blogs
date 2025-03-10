import React from 'react';
import "./css/soon.css";

function InDevelopment(){
    return(
        <div id='soon'>
            <h1>This feature is under develope<br></br></h1>
            <p>Comming soon...</p>
            <button id="Home" onClick={()=> {window.location.href = "/"}}>GO HOME</button>
        </div>
    )
}

export default InDevelopment;