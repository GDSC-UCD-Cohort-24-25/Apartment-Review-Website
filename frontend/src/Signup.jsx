import React from 'react';
import './Signup.css';
import supabase from './supabase-client';
import { useState } from "react";
import { Link } from "react-router-dom";


const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
  

    const handleClick = async () => {
        const { data, error } = await supabase.auth.getSession()
        console.log(data)
        console.log("Button clicked!");
    };

    
    const logOut = async () => {
        const { error } = await supabase.auth.signOut()
        console.log("Button clicked!");
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setEmail("");
        setPassword("");

        const { data, error } = await supabase.auth.signUp({email: email, password: password, });
        if (error) { 
            setMessage(error.message); return; 
        }
        if (data) { 
            setMessage("User account created!"); 
        }
  };    
  
    return (
      <div className="Signup-page">
      <h1>Sign Up</h1>
      {message && <span>{message}</span>}
        <form className="auth" onSubmit={handleSubmit}>
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
            <button type="submit">Create Account</button>
            
        </form> 
        <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
        </p> 
        <button onClick={handleClick}>Click Me</button>
        <button onClick={logOut}>Log out </button>
      
    </div>
    );
};

export default Signup;
