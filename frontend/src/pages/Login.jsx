import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

import { useState } from "react";
import supabase from "../supabase-client.js";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage("");
      setEmail("");
      setPassword("");

      const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password });
      if (error) { setMessage(error.message); return; }
      if (data) { navigate(`/profile/${data.session.user.id}`); return; }         

    };

  return (
      <div className="Login-page">
          <h1>Login</h1>
          <form className="auth" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <input 
              type="current-password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <button type="submit"> Login </button>
            {message && <span>{message}</span>}
          </form>

          <p className="">
            Don't have an account?{" "}
            <Link to="/signup">
              Sign up
            </Link>
          </p>
      </div>
  );
};

export default Login;
