import React, { useEffect, useState } from 'react';
import {useNavigate } from "react-router-dom";
import styles from "./css/buttons.module.css"
import "./css/Main.css";
import "./css/MainBlogs.css"
import "./Blogs.js";
import HeaderText from "./HeaderText.js";

function Main(){
  const [blogs, setBlogs] = useState([]);
  const [limit, setLimit] = useState(10);
  var [offset, setOffset] = useState(0);
  const navigate = useNavigate();

    //changing format of dates
    const formatDate = (dateString) => {
      const date = new Date(dateString);
    
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-GB', options);
    };

  //Getting all public blogs 
  useEffect(() => {
    const getAllBlogs = async () => {
      const req = await fetch(`/api/v1/blogs?offset=${offset}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (req.ok) {
        const data = await req.json();
        if (data.state === "success") {
          if (data.blogs.len > 0) {
            setBlogs((prevBlogs) => [...prevBlogs, ...data.blogs.content]);
          }
        }
      }
    };
  
    getAllBlogs();
  }, [offset, limit]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        setOffset((prevOffset) => prevOffset + 10);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  

  function ShowBLogs(){
    if(blogs.length > 0){
        return(
            <>
                {blogs.map((blog) => (
                    <div className='MainPage-blogs' onClick={() => {navigate(`/blogs/${blog.blog_id}`)}}>
                        <h1 className='MainPage-blogs-title'>{ blog.blog_title.length <= 28 ? blog.blog_title : (blog.blog_title.substring(0, 28) + "...")}</h1>
                        <div className='MainPage-blogs-image-container'>
                          <img src={blog.blog_thumbnail}></img>
                        </div>
                        <div>
                        <p className='MainPage-blogs-summary'>{blog.blog_content.substring(0,200) + "..."}</p>
                        </div>
                        <p id="MainPage-blogs-createdAt">{formatDate(Number(blog.createdAt))}</p>
                        <p id='MainPage-blogs-username'><a className='MainPage-blogs-username-a' href={`/writer/${blog.user.userid}`} onClick={(e) => {e.stopPropagation();}}>{blog.user.username}</a></p>
                        <img id="MainPage-blogs-username-pic" onClick={(e) => {e.stopPropagation();navigate(`/writer/${blog.user.userid}`)}} src={blog.user.profilePic}></img>
                        <hr className='MainPage-blogs-end'></hr>                     
                    </div>
                ))}
            </>
        )
    }else{
        return(
            <div id="MainPage-noBlogs"><p>There is no any blog yet</p></div>
        )
    }
  }
  return(
    <>
      <HeaderText />
      <hr></hr>
      <h3 id="HomeBTN">Home</h3>
      <h3 id="MyBlogsBTN" onClick={() => {navigate("/myaccount/dashboard")}} style={{color: "gray"}}>My Blogs</h3>
      <h3 id="SearchBTN" onClick={() => {navigate("/search")}} style={{color: "gray"}}>Search</h3>
      <h3 id="FavBTN" onClick={() => {navigate("/myaccount/favorites")}} style={{color: "gray"}}>Favorites</h3>
      <h3 id="SupportBTN" onClick={() => {window.location.href = "/Comming-soon"}} style={{color: "gray"}}>Support</h3>
      <button id="LoginBTN" onClick={() => {navigate("/login")}} className={styles.hoverBTN}>Account</button>
      <ShowBLogs />
    </>
  )
}

export default Main;