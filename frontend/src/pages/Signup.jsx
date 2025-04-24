import React from 'react';
import './Signup.css';
import supabase from '../supabase-client';
import { useState } from "react";
import { Link } from "react-router-dom";


const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setEmail("");
        setPassword("");

        const { data, error } = await supabase.auth.signUp({email: email, password: password, });
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
                value = {name}
                type = "name"
                placeholder = "Name"
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
                type="new-password"
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
