import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Posts({ setCurrentPage, JWT, setCreatingPost, setPostId, setUpdated, updated, postsType, query, setQuery, currentUsername}) {
    const [posts, setPosts] = useState([]);
    const [iconHovered, setIconHovered] = useState(null);

    useEffect(() => {
        if (postsType === "search") {
            axios.get('/search_posts', {
                params: {
                    sentence: query
                }
            })
            .then(async response => {
                setPosts(response.data);
                setQuery("");
            })
            .catch(error => {
                console.error(error);
            });
        }
        else {
            axios.get('/filter_posts', {
                params: {
                    user: currentUsername,
                    filter: postsType
                }
            })
            .then(async response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }, [updated]);

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

    function formatDate(isoString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(isoString).toLocaleDateString(undefined, options);
    }

    async function handleClickPost(title, id, body) {
        // don't activate post if like button is being clicked
        if (iconHovered !== id) {
            setCurrentPage("post");
            setPostId(id);
            setUpdated(!updated);

            try {
                await axios.post(`/gateway/recommendations/add_visited`, {
                    title: title,
                    postId: id,
                    content: body,
                    date: new Date().toISOString()
                }, {
                    headers: {
                        'Authorization': `Bearer ${JWT}`
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <>
            <div className="linkContainer" onClick={() => setCreatingPost(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" className="linkIcon">
                    <defs>
                        <polygon id="path-1" points="0.000243902439 0.000243902439 20 0.000243902439 20 20 0.000243902439 20"/>
                    </defs>
                    <path d="M14.3750244,9.148 L10.7730732,9.148 L10.7730732,5.54604878 C10.7730732,5.12507317 10.4320976,4.78409756 10.011122,4.78409756 C9.59014634,4.78409756 9.24868293,5.12507317 9.24868293,5.54604878 L9.24868293,9.148 L5.64673171,9.148 C5.2262439,9.148 4.88478049,9.48897561 4.88478049,9.90995122 C4.88478049,10.3309268 5.2262439,10.6723902 5.64673171,10.6723902 L9.24868293,10.6723902 L9.24868293,14.2743415 C9.24868293,14.6953171 9.58965854,15.0362927 10.011122,15.0362927 C10.4316098,15.0362927 10.7730732,14.6953171 10.7730732,14.2743415 L10.7730732,10.6723902 L14.3750244,10.6723902 C14.7955122,10.6723902 15.1369756,10.3309268 15.1369756,9.90995122 C15.1369756,9.48946341 14.796,9.148 14.3750244,9.148" id="Fill-1" fill="#006AC3"/>
                    <path d="M10.0109756,18.5470732 C5.28853659,18.5470732 1.4602439,14.7134146 1.4602439,9.98365854 C1.4602439,5.25439024 5.28853659,1.42073171 10.0109756,1.42073171 C14.7334146,1.42073171 18.5612195,5.25439024 18.5612195,9.98365854 C18.5612195,14.7134146 14.7334146,18.5470732 10.0109756,18.5470732 M10.0002439,0.000243902439 C4.48609756,0.000243902439 0.000243902439,4.48609756 0.000243902439,10.0002439 C0.000243902439,15.5139024 4.48609756,20.0002439 10.0002439,20.0002439 C15.5139024,20.0002439 20.0002439,15.5139024 20.0002439,10.0002439 C20.0002439,4.48609756 15.5139024,0.000243902439 10.0002439,0.000243902439" id="Fill-3" fill="#006AC3"/>
                    <path d="M10,18.5365854 C5.29317073,18.5365854 1.46341463,14.7068293 1.46341463,10 C1.46341463,5.29317073 5.29317073,1.46341463 10,1.46341463 C14.7068293,1.46341463 18.5365854,5.29317073 18.5365854,10 C18.5365854,14.7068293 14.7068293,18.5365854 10,18.5365854 M10.0107317,1.42097561 C5.28878049,1.42097561 1.46,5.25463415 1.46,9.98390244 C1.46,14.7131707 5.28878049,18.5468293 10.0107317,18.5468293 C14.7331707,18.5468293 18.5614634,14.7131707 18.5614634,9.98390244 C18.5614634,5.25463415 14.7331707,1.42097561 10.0107317,1.42097561" id="Fill-6" fill="#006AC3"/>
                </svg>
                <p className="linkText">Create a post...</p>
            </div>
            {posts.map(post => (
                <div key={post.postId}>
                    <div className="cardHeader postHeader">
                        <span>{post.username}</span>
                        <span>{formatDate(post.date)}</span>
                    </div>

                    <div className="post fancyBorder" onClick={() => {handleClickPost(post.title, post.postId, post.content)}}>
                        <p className="postTitle">{post.title}</p>
                        <p className="postDescription">{post.content}</p>

                        <div className="iconContainer" onClick={() => {likePost(post.postId)}} onMouseEnter={() => setIconHovered(post.postId)} onMouseLeave={() => setIconHovered(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="icon">
                                <path stroke="currentColor" strokeWidth="1.4" d="m10.723 4.632.002-.002c.69-.691 1.61-1.1 2.58-1.154l.228-.006a3.958 3.958 0 0 1 2.79 6.758l-6.29 6.29a.044.044 0 0 1-.063 0l-6.29-6.29A3.959 3.959 0 0 1 9.277 4.63l.227.227.493.494.496-.492.229-.227Z"/>
                            </svg>
                            <p>{post.likes}</p>
                        </div>
                        <div className="iconContainer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="icon">
                                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" d="M4 5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7l-3 3V5Z"/>
                            </svg>
                            <p>{post.commentCount}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Posts;