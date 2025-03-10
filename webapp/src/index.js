import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Setting from './Setting/Setting';
import SettingAccount from './Setting/Account';
import SettingPassword from './Setting/Password';
import NewPost from "./NewPost";
import Preview from './PreviewBlogs';
import Blogs from "./Blogs";
import EditBlogs from './EditBlogs';
import Favorites from './Favorites';
import Likes from './LikedBlogs';
import Search from './Search';
import NotFound from './NotFound';
import InDevelopment from './inproduction';
import ForgotPassword from './ForgotPassword';
import MagicLink from "./MagicLink";
import Notifications from './Notifications';
import SingleComment from "./SingleComment";
import UserProfile from './Profile/index';
import UserProfileAbout from './Profile/About';
import UserProfileLiked from './Profile/likedBlogs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Comming-soon" element={<InDevelopment />} />
        <Route path="/search" element={<Search />} />
        <Route path="/blogs/:blogId" element={<Blogs />} />
        <Route path="/blogs/:blogId/comments/:commentId" element={<SingleComment />} />
        <Route path="/blogs/magicLink" element={<MagicLink />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/writer/:userid" element={<UserProfile />} />
        <Route path="/writer/:userid/liked" element={<UserProfileLiked />} />
        <Route path="/writer/:userid/about" element={<UserProfileAbout />} />
        <Route path="/myaccount/dashboard" element={<Dashboard />} />
        <Route path="/myaccount/notifications" element={<Notifications />} />
        <Route path="/myaccount/setting" element={<Setting />} />
        <Route path="/myaccount/setting/account" element={<SettingAccount />} />
        <Route path="/myaccount/setting/password" element={<SettingPassword />} />
        <Route path="/myaccount/new" element={<NewPost />} />
        <Route path="/myaccount/favorites" element={<Favorites />} />
        <Route path="/myaccount/likes" element={<Likes />} />
        <Route path="/myaccount/blogs/:blogId" element={<Preview />} />
        <Route path="/myaccount/blogs/:blogId/edit" element={<EditBlogs />} />
        <Route path="/not-found" element={<NotFound />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);