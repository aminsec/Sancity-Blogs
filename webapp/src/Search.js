import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import HeaderText from "./HeaderText.js";
import styles from "./css/buttons.module.css"
import "./css/Search.css"

function Search(){
    const [blogs, setBlogs] = useState();
    const navigate = useNavigate();

    async function sendHTTP(){
        var query = document.getElementById("search-input").value;
        const request = await fetch(`/api/v1/blogs/search?q=${query}`);
        if(request.ok){
            const data = await request.json();
            console.log(data.blogs)
            setBlogs(data.blogs)
        }
    }

    //changing format of dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-GB', options);
        };

    function ShowBLogs(){
        if(blogs){
            if(blogs.length > 0){
                return(
                    <>
                        {blogs.map((blog) => (
                            <div className='SearchPage-blogs' onClick={() => {navigate(`/blogs/${blog.blog_id}`)}}>
                                <h1 className='SearchPage-blogs-title'>{ blog.blog_title.length <= 28 ? blog.blog_title : (blog.blog_title.substring(0, 28) + "...")}</h1>
                                <div className='SearchPage-blogs-image-container'>
                                    <img src={blog.blog_thumbnail}></img>
                                </div>
                                <p className='SearchPage-blogs-summary'>{blog.blog_content.substring(0,200)}</p>
                                <p id="SearchPage-blogs-createdAt">{formatDate(Number(blog.createdAt))}</p>
                                <p id='SearchPage-blogs-username'><a className='SearchPage-blogs-username-a' href={`/writer/${blog.user.userid}`} onClick={(e) => {e.stopPropagation();}}>{blog.user.username}</a></p>
                                <img id="SearchPage-blogs-username-pic" onClick={(e) => {e.stopPropagation(); navigate(`/writer/${blog.user.userid}`)}} src={blog.user.profilePic}></img>
                                <hr className='SearchPage-blogs-end'></hr>                     
                            </div>
                        ))}
                    </>
                )
            }else{
                return(
                    <div id="SearchPage-noBlogs"><p>There is no any blog yet</p></div>
                )
            }
        }
    }
    return(
        <>
          <HeaderText />
          <hr></hr>
          <h3 id="HomeBTN" onClick={() => {navigate("/")}} style={{color: "gray"}}>Home</h3>
          <h3 id="MyBlogsBTN" onClick={() => {navigate("/myaccount/dashboard")}} style={{color: "gray"}}>My Blogs</h3>
          <h3 id="SearchBTN">Search</h3>
          <h3 id="FavBTN" onClick={() => {navigate("/myaccount/favorites")}} style={{color: "gray"}}>Favorites</h3>
          <h3 id="SupportBTN" onClick={() => {window.location.href = "http://support.sancity.blog"}} style={{color: "gray"}}>Support</h3>
          <button id="LoginBTN" onClick={() => {navigate("/login")}} className={styles.hoverBTN}>Account</button>
          <input id="search-input" placeholder='Search it' onKeyDown={sendHTTP}></input>
          <ShowBLogs />
        </> 
    )
}

export default Search;