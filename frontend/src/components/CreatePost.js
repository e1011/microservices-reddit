import React, { useState } from 'react';
import axios from 'axios';

function CreatePost({ setCreatingPost, JWT, setUpdated, updated, setPostsType}) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    async function handleSubmit() {
        if (!JWT) {
            alert("You must be logged in to create a post.");
            return;
        }

        const postData = {
            title: title,
            content: body,
            date: new Date().toISOString()
        };

        try {
            await axios.post('/gateway/posts/add_post', postData, {
                headers: {
                    'Authorization': `Bearer ${JWT}`
                }
            });

            alert("Post created successfully!");
            setPostsType("recommended");
            setUpdated(!updated);
            setCreatingPost(false); 
        } catch (error) {
            console.error(error);
            alert("Failed to create post. Please try again.");
        }
    }

    return (
        <>
            <div className="popupOverlay" onClick={() => { setCreatingPost(false) }} />
            <div className="popupContainer createPostContainer">
                <div className="popupHeader createPostHeader">
                    <span>Create a new post</span>
                </div>

                <p className="popupLabel">Title</p>
                <input className="input titleInput" value={title} placeholder="Write a specific title" onChange={(e) => {setTitle(e.target.value)}} />
                <p className="popupLabel">Body</p>
                <textarea className="input bodyInput" value={body} placeholder="Write a body" onChange={(e) => {setBody(e.target.value)}} />
                <div style={{ display: 'flex' }}>
                    <button className="button loginButton" onClick={handleSubmit}>Post</button>
                    <button className="button cancelButton" onClick={() => { setCreatingPost(false) }}>Cancel</button>
                </div>
            </div>
        </>
    );
}

export default CreatePost;