import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Navbar({ setCurrentPage, JWT, setPostsType, updated, setUpdated, setPostId}) {
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const response = await axios.get('/gateway/recommendations/get_visited_posts', {
                    headers: {
                        'Authorization': `Bearer ${JWT}`
                    }
                });
                setRecentPosts(response.data);
            } catch (error) {
                console.error('Error fetching recent posts:', error);
            }
        };

        fetchRecentPosts();
    }, [updated]);

    function handleRecommendedClicked() {
        setCurrentPage("posts");
        setPostsType("recommended");
        setUpdated(!updated);
    };

    function handlePopularClicked() {
        setCurrentPage("posts");
        setPostsType("popular");
        setUpdated(!updated);
    };

    function handleLatestClicked() {
        setCurrentPage("posts");
        setPostsType("latest");
        setUpdated(!updated);
    };

    function handleAuthoredClicked() {
        setCurrentPage("posts");
        setPostsType("authored");
        setUpdated(!updated);
    };

    function handleRecentClicked(id) {
        setCurrentPage("post");
        setPostId(id);
        setUpdated(!updated);
    }

    return (
        <div className="navbar">
            <p className="navHeader">Find posts</p>
            <div className="dividerLong"></div>
            <button className="navRoute active" onClick={handleRecommendedClicked}>Recommended</button>
            <div className="dividerShort"></div>
            <button className="navRoute" onClick={handlePopularClicked}>Popular</button>
            <div className="dividerShort"></div>
            <button className="navRoute" onClick={handleLatestClicked}>Latest</button>
            <div className="dividerShort"></div>
            <button className="navRoute" onClick={handleAuthoredClicked}>Authored</button>
            <div className="dividerLong"></div>

            <p className="navHeader">Recent</p>
            <div className="dividerLong"></div>
            {recentPosts.length > 0 ? (
                recentPosts.map((post, index) => (
                    <div key={index}>
                        <button className="navRoute" onClick={() => {handleRecentClicked(post.postId)}}>{post.title}</button>
                        {index < recentPosts.length - 1 && <div className="dividerShort"></div>}
                    </div>
                ))
            ) : (
                <p>No recent posts</p>
            )}
            <div className="dividerLong"></div>
        </div>
    );
}

export default Navbar;
