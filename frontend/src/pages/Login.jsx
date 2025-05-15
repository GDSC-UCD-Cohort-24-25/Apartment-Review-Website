import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import supabase from "../supabase-client.js";
import '../App.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    if (data) {
      navigate(`/profile`);
    }
  };

  return (
    <div className="Login-page">
      <div className="frame"> 
        <div className="headerLI">
          <h1>Welcome</h1>
          <button className="largeButton">
            <Link to="/signup">Sign up</Link>
          </button>
        </div>

        <form className="auth" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email*" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password*" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />

          <div className="forgot">
            <p>Forgot Password?</p>
          </div>

          <button className="primary" type="submit">Login</button>
          {message && <span>{message}</span>}
        </form> 
      </div>
    </div>
  );
};

export default Login;
