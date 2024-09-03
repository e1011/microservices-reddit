import React from 'react';
import {useState} from 'react';
import axios from 'axios';

function Login({setLoginOpen, setJWT, updated, setUpdated}){
    const [newAccount, setNewAccount] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    async function handleRegister() {
        if (username && password && email) {
            try {
                const response = await axios.post('/gateway/users/add_user', {
                    username: username,
                    password: password,
                    email: email
                });
                alert(`Successfully registered account with username ${username}, you may now sign in.`);
                setEmail("");
                setPassword("");
                setNewAccount(false);
            } catch (error) {
                alert("Failed to register.");
                console.error(error);
            }
        }
        else {
            alert("Please dont leave any fields blank.");
        }
    }

    async function handleLogin() {
        if (username && password) {
            try {
                const response = await axios.post('/gateway/users/check_user', {
                    username: username,
                    password: password
                });
        
                const token = response.data.token;
                setJWT(token);
                setLoginOpen(false);
                alert(`Successfully signed in as ${username}`);
                setUsername("");
                setPassword("");
                setUpdated(!updated);
            } catch (error) {
                alert("Failed to sign in.");
                console.error(error);
            }
        } 
        else {
            alert("Please dont leave any fields blank.");
        } 
    }

    return (   
        <>
            <div className="popupOverlay" onClick={() => {setLoginOpen(false)}}/>
            <div className="popupContainer loginContainer">
                <div className="popupHeader loginHeader"> 
                    {newAccount ? <span>Create a new account</span> : <span>Sign into your account</span>}
                </div>
                {newAccount && 
                    <>
                        <p className="popupLabel">Email</p>
                        <input className="input" value={email} placeholder="Enter email..." onChange={handleEmailChange}/>
                    </>
                }
                <p className="popupLabel">Username</p>
                <input className="input" value={username} placeholder="Enter username..." onChange={handleUsernameChange}/>
                <p className="popupLabel">Password</p>
                <input className="input" value={password} placeholder="Enter password..." onChange={handlePasswordChange}/>
                <div style={{"display": 'flex'}}>
                    {newAccount ? <button className="button loginButton" onClick={handleRegister}>Sign Up</button>  : <button className="button loginButton" onClick={handleLogin}>Sign In</button> }
                    <button className="button cancelButton" onClick={() => {setLoginOpen(false)}}>Cancel</button>
                </div>
                {newAccount? 
                    <div className="loginFooter" onClick={() => {setNewAccount(false)}}> 
                        <span>Log into existing account</span>
                    </div>:
                    <div className="loginFooter" onClick={() => {setNewAccount(true)}}> 
                        <span>Create a new account</span>
                    </div>
                }
            </div>
        </>
    );
}

export default Login;