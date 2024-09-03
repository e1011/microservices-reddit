import React, { useState } from 'react';
import Login from './Login';
import Navbar from './Navbar';
import Header from './Header';
import Post from './Post';
import Posts from './Posts';
import CreatePost from './CreatePost';

function Home() {

  const [JWT, setJWT] = useState(null);
  const [postId, setPostId] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [currentPage, setCurrentPage] = useState("posts");
  const [updated, setUpdated] = useState(true);
  const [postsType, setPostsType] = useState("recommended");
  const [query, setQuery] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");

  return (
    <div className="pageLayout">
        <Header currentUsername={currentUsername} setCurrentUsername={setCurrentUsername} setLoginOpen={setLoginOpen} JWT={JWT} query={query} setQuery={setQuery} setPostsType={setPostsType} updated={updated} setUpdated={setUpdated}/>
      <div className="bottomLayout">
        <Navbar setCurrentPage={setCurrentPage} JWT={JWT} setPostsType={setPostsType} updated={updated} setUpdated={setUpdated} setPostId={setPostId}/>
        {JWT &&
        <div className="posts">
          {currentPage === "post" && <Post setCurrentPage={setCurrentPage} JWT={JWT} postId={postId} setPostId={setPostId} setUpdated={setUpdated} updated={updated}/>}
          {currentPage === "posts" && <Posts currentUsername={currentUsername} setCurrentPage={setCurrentPage} JWT={JWT} setCreatingPost={setCreatingPost} setPostId={setPostId} setUpdated={setUpdated} updated={updated} postsType={postsType} query={query} setQuery={setQuery}/>}
        </div>
        }
      </div>
      {loginOpen && <Login setLoginOpen={setLoginOpen} updated={updated} setUpdated={setUpdated} setJWT={setJWT}/>}
      {creatingPost && <CreatePost setCreatingPost={setCreatingPost} JWT={JWT} setUpdated={setUpdated} setPostsType={setPostsType} updated={updated}/>}
    </div>

  );
}

export default Home;

