import React from 'react';
import "./css/NewPost.css"
import { useState, useEffect } from 'react';
import { checkIsUserLogin } from './Login';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function NewPost(){
    const navigate = useNavigate();
    const [updateMessage, setUpdateMessage] = useState("");
    const [dataUpdated, setDataUpdated] = useState("");
    const [privatePost, setPrivtePost] = useState(false);
    const [commentsOff, setCommentsOff] = useState(false);
    const [showLikes, setShowLikes] = useState(false);

    //Checking if user has logged in or not
    useEffect(() => {
        checkIsUserLogin(navigate)
    }, [])
    
    function changePrivate(){
        if(privatePost){
            setPrivtePost(false)
        }else{
            setPrivtePost(true);
        }
    }

    function changeComment(){
        if(commentsOff){
            setCommentsOff(false)
        }else{
            setCommentsOff(true);
        }
    }

    function changeLikes(){
        if(showLikes){
            setShowLikes(false)
        }else{
            setShowLikes(true);
        }
    }

    function handleUpload(e){
        const selectedFile = e.target.files[0];
        var reader  = new FileReader();
        reader.readAsDataURL(selectedFile);
        
        reader.onloadend = function () {
            document.getElementById("image-bannerPic").src = reader.result;
            document.getElementById("main-hidden-image-bannerPic").src = reader.result;
        };
    }

    function handleThumbnailUpload(e){
        const selectedFile = e.target.files[0];
        var reader  = new FileReader();
        reader.readAsDataURL(selectedFile);
        
        reader.onloadend = function () {
            document.getElementById("thumbnail").src = reader.result;
            document.getElementById("main-hidden-thumbnail").src = reader.result;
        };
    }

    function publish(){
        //converting loaded banner to binary
        const img = document.getElementById('main-hidden-image-bannerPic');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const base64Image = canvas.toDataURL('image/png');

        //converting loaded thumbnail to binary
        const thumbnail_img = document.getElementById('main-hidden-thumbnail');
        const thumbnail_canvas = document.createElement('canvas');
        const thumbnail_ctx = thumbnail_canvas.getContext('2d');
        thumbnail_canvas.width = thumbnail_img.width;
        thumbnail_canvas.height = thumbnail_img.height;
        thumbnail_ctx.drawImage(thumbnail_img, 0, 0);
        const thumbnail_base64Image = thumbnail_canvas.toDataURL('image/png');

        const data = {
            bannerPic: base64Image,
            thumbnail: thumbnail_base64Image,
            title: document.getElementById("titleINP").value,
            body: document.getElementById("blog-body").value,
            tags: document.getElementById("tagsINP").value,
            option: {
                is_public: privatePost,
                commentsOff: commentsOff,
                showLikes: showLikes
            }
        }

        var http = new XMLHttpRequest();
        http.open("POST", "/api/v1/user/blogs/new");
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.send(JSON.stringify(data));

        http.onreadystatechange = () => {
            if(http.readyState == 4 && http.status == 200){
                const data = JSON.parse(http.responseText);
                if(data.state == "success"){
                    setDataUpdated(data.state);
                    setUpdateMessage(data.message);
                    window.scrollTo(0, 0);
                }
            }else if(http.readyState == 4 && http.status != 200){
                console.log('123')
                const data = JSON.parse(http.responseText);
                setDataUpdated(data.state);
                setUpdateMessage(data.message);
                window.scrollTo(0, 0);
            }
        }
    }

    return(
        <>
            
            {dataUpdated == "success" && <div id="blogAdded"><p>{updateMessage}. Go to <Link to="/myaccount/dashboard">Dashboard</Link></p></div>}
            {dataUpdated == "failed" && <div id="blogAddedFailed"><p>{updateMessage}</p></div>}
            <h2 id="title">Title</h2>
            <input id="titleINP" placeholder='Enter your title...'></input>
            <h2 id="blog-body-title">Body</h2>
            <textarea id="blog-body" placeholder='Enter what you want...'></textarea>
            <h2 id="banner">Set a banner</h2>
            <p id="recomendedSize"> recomended(2900x390)</p>
            <div id="new-bannerPic">
                <img id="image-bannerPic" src="/statics/img/defaultBanner.jpg"></img>
                <img style={{display: "none"}} id="main-hidden-image-bannerPic" src="/statics/img/defaultBanner.jpg"></img>
            </div>
            <input id="bannerUpload" type='file' onChange={handleUpload}></input>
            <h2 id="thumbnail-title">Set a thumbnail</h2>
            <p id="recomendedSize-thumbnail">recomended(300x200)</p>
            <img id="thumbnail" src="/statics/img/default-thumbnail.jpg"></img>
            <img style={{display: "none"}} id="main-hidden-thumbnail" src="/statics/img/default-thumbnail.jpg"></img>
            <input id="upload-thumbnail" type='file' onChange={handleThumbnailUpload}></input>
            <h2 id="tags">Tags</h2>
            <input id="tagsINP" placeholder='Tags like #AI #programming... '></input>
            <h2 id="options">Options</h2>

            <label className="switch" >
                <input id="makePrivateBlog" type="checkbox" onClick={changePrivate}></input>
                <span className="slider round"></span>
            </label>
            <h4 id="private-opt">Public</h4>

             <label id="switch" >
                <input id="makeCommentOff" type="checkbox" onClick={changeComment}></input>
                <span className="slider round"></span>
            </label>
            <h4 id="comments-opt">Comments off</h4>

            <label id="switch3" >
                <input id="changeShowsOfLike" type="checkbox" onClick={changeLikes}></input>
                <span className="slider round"></span>
            </label>
            <h4 id="likes-opt">Show likes</h4> 

            <button id="publishBTN" onClick={publish}>Publish</button>
            <img src="/statics/img/back.png" id="backBTN" onClick={() => {navigate("/myaccount/dashboard")}}></img>
            <p id="tempText" typeof='hidden'>a</p>
        </>
    )
}

export default NewPost;