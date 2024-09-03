import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Post({setCurrentPage, JWT, postId, setPostId, setUpdated, updated}) {

    const [post, setPost] = useState(null);
    const [content, setContent] = useState("");
    const [replying, setReplying] = useState(false);
    const [replyingUsername, setReplyingUsername] = useState("");
    const [commentId, setCommentId] = useState(null);

    useEffect(() => {
        axios.get(`/gateway/posts/get_post/${postId}`, {
            headers: {
                'Authorization': `Bearer ${JWT}`
            }
        })
            .then(async response => {
                setPost(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [updated]);

    function handleEscape() {
        setCurrentPage("posts");
        setPostId(null);
        setUpdated(!updated);
    }

    function handleCommentChange(e) {
        setContent(e.target.value);
    }

    async function addComment() {
        try {
            // add comment
            await axios.post('/gateway/comments/add_comment', {
                postId: postId,
                content: content,
                date: new Date().toISOString()
            }, {
                headers: {
                    'Authorization': `Bearer ${JWT}`,
                }
            });

            setUpdated(!updated);
            setContent("");
            alert("Comment added successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to add comment");
        }
    }

    async function addReply(commentId) {
        try {
            const response = await axios.post('/gateway/replies/add_reply', {
                commentId: commentId,
                content: content,
                date: new Date().toISOString()
            }, {
                headers: {
                    'Authorization': `Bearer ${JWT}`,
                }
            });
    
            setUpdated(!updated);
            setContent("");
            setReplying(false);
            alert("Reply added successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to add reply.");
        }
    }
    
    async function likePost(id) {
        try {
            await axios.patch(`/gateway/posts/like_post/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${JWT}`
                }
            });
    
            setUpdated(!updated);
        } catch (error) {
            console.error(error);
        }
    }

    async function likeComment(id) {
        try {
            await axios.patch(`/gateway/comments/like_comment/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${JWT}`
                }
            });
    
            setUpdated(!updated);
        } catch (error) {
            console.error(error);
        }
    }

    async function likeReply(id) {
        try {
            await axios.patch(`/gateway/replies/like_reply/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${JWT}`
                }
            });
    
            setUpdated(!updated);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleReplyClicked(commentId, username) {
        setReplying(true);
        setCommentId(commentId);
        setReplyingUsername(username);
        setContent("");
    }

    function handleCancelClicked() {
        setReplying(false);
        setCommentId(null);
        setContent("");
    }

    function formatDate(isoString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(isoString).toLocaleDateString(undefined, options);
    }

    if (!post) {
        return <></>;
    }

    return (
        <> 
            <div className="linkContainer" onClick={handleEscape}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 15" class="linkIcon">
                    <g data-name="Layer 2">
                        <g data-name="Navigation/Misc">
                        <path data-name="icon-go-to (20)" fill="#006ac3" d="M12.3 0l-.73.71L18.02 7H0v1.01h18.02l-6.45 6.28.73.71L20 7.5 12.3 0z"/>
                        </g>
                    </g>
                </svg>
                <p className="linkText">Back</p>
            </div>

            <div className="cardHeader postHeader">
                <span>{post.username}</span>
                <span>{formatDate(post.date)}</span>
            </div>

            <div className="post fancyBorder">
                <p className="postTitle">{post.title}</p>
                <p className="postDescription">{post.content}</p>

                <div className="iconContainer" onClick={() => likePost(postId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" class="icon">
                        <path stroke="currentColor" stroke-width="1.4" d="m10.723 4.632.002-.002c.69-.691 1.61-1.1 2.58-1.154l.228-.006a3.958 3.958 0 0 1 2.79 6.758l-6.29 6.29a.044.044 0 0 1-.063 0l-6.29-6.29A3.959 3.959 0 0 1 9.277 4.63l.227.227.493.494.496-.492.229-.227Z"/>
                    </svg>
                    <p>{post.likes}</p>
                </div>
                <div className="iconContainer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" class="icon">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="1.4" d="M4 5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7l-3 3V5Z"/>
                    </svg>
                    <p>{post.commentCount}</p>
                </div>
            </div>

            <div className="postFooter">
                {post.comments.map(comment => (
                    <div key={comment.commentId}>
                        <div className="cardHeader commentHeader">
                            <span>{comment.username}</span>
                            <span>{formatDate(comment.date)}</span>
                        </div>
                        <div className="comment">
                            <p>{comment.content}</p>
                            <div className="iconContainer" onClick={() => likeComment(comment.commentId)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" class="icon">
                                    <path stroke="currentColor" stroke-width="1.4" d="m10.723 4.632.002-.002c.69-.691 1.61-1.1 2.58-1.154l.228-.006a3.958 3.958 0 0 1 2.79 6.758l-6.29 6.29a.044.044 0 0 1-.063 0l-6.29-6.29A3.959 3.959 0 0 1 9.277 4.63l.227.227.493.494.496-.492.229-.227Z"/>
                                </svg>
                                <p>{comment.likes}</p>
                            </div>
                            {commentId === comment.commentId ?
                            <div className="iconContainer" onClick={handleCancelClicked}>
                                <p>Cancel</p>
                            </div>
                            :
                            <div className="iconContainer" onClick={() => {handleReplyClicked(comment.commentId, comment.username)}}>
                                <p>Reply</p>
                            </div>
                            }
                        </div>

                        {comment.replies.map(reply => (
                            <div key={reply.replyId}>
                                <div className="cardHeader replyHeader">
                                    <span>{reply.username}</span>
                                    <span>{formatDate(reply.date)}</span>
                                </div>
                                <div className="reply comment">
                                    <p>{reply.content}</p>
                                    <div className="iconContainer" onClick={() => likeReply(reply.replyId)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" class="icon">
                                            <path stroke="currentColor" stroke-width="1.4" d="m10.723 4.632.002-.002c.69-.691 1.61-1.1 2.58-1.154l.228-.006a3.958 3.958 0 0 1 2.79 6.758l-6.29 6.29a.044.044 0 0 1-.063 0l-6.29-6.29A3.959 3.959 0 0 1 9.277 4.63l.227.227.493.494.496-.492.229-.227Z"/>
                                        </svg>
                                        <p>{reply.likes}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {replying? 
            <div className="createCommentContainer">
                <textarea className="input createComment" value={content} placeholder={`Add a reply to ${replyingUsername}'s comment`} onChange={handleCommentChange}></textarea>
                <button className="loginButton button commentButton" onClick={() => {addReply(commentId)}}>Post</button> 
            </div>
            :
            <div className="createCommentContainer">
                <textarea className="input createComment" value={content} placeholder="Add a comment" onChange={handleCommentChange}></textarea>
                <button className="loginButton button commentButton" onClick={addComment}>Post</button> 
            </div>
            }
        </> 
    );
}

export default Post;