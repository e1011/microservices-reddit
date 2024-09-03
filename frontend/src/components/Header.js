import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Header({setLoginOpen, JWT, query, setQuery, setPostsType, updated, setUpdated, currentUsername, setCurrentUsername}){

    useEffect(() => {
        axios.get('/gateway/users/get_current_username', {
            headers: {
                'Authorization': `Bearer ${JWT}`
            }
        })
        .then(response => {
            setCurrentUsername(response.data.username);
        })
        .catch(error => {
            console.error(error);
        });
    }, [JWT]);

    function handleSearchChange(e) {
        setQuery(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setPostsType("search");
        setUpdated(!updated);
    }

    return (   
        <div className="header">
            <p className="postTitle">Microservices Reddit</p>
            <form onSubmit={handleSubmit}>
                <input className="input search" value={query} placeholder="Search" onChange={handleSearchChange}/>
            </form>
            {JWT ? 
            <p className="postTitle">{currentUsername}</p> :
            <p className="postTitle" onClick={() => {setLoginOpen(true)}}>Sign In</p>
            }
        </div>
    );
}

export default Header;