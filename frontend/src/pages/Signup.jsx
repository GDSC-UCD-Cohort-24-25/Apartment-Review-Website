import React from 'react';
import './Signup.css';
import supabase from '../supabase-client';
import { useState } from "react";
import { Link } from "react-router-dom";


const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState('');
    const [handle, setHandle] = useState('');

    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setEmail("");
        setPassword("");
        setName("")

        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name: name,
              handle: handle,
              avatar_url: ""
            }
          }
        });
        if (error) { setMessage(error.message); return;}
        if (data) { setMessage("User account created!"); return; }
    };    
  
    return (
      <div className="Signup-page">
        <div class = "frame"> 
          <div class = "header"> 
            <h1>Welcome</h1>
            <button class = "largeButton">
              <Link to="/login" className="">
              Login
              </Link>
            </button>
          </div> 
            {message && <span>{message}</span>}
            <form className="auth" onSubmit={handleSubmit}>
              <input 
                onChange = {(e) => setName(e.target.value)} 
                value={name}
                type = "text"
                placeholder = "Name"
                required 
              />
              <input 
                onChange={(e) => setHandle(e.target.value)} 
                value={handle}
                type="text"
                placeholder="Preferred Username"
                required
              />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
              <button class = "signinButton" type="submit">Create Account</button>
                    
              </form> 
        </div>    
    </div>
    );
};

export default Signup;
