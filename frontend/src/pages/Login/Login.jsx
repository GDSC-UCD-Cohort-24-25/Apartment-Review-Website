import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import supabase from "../../supabase-client";
import dotenv from 'dotenv';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
  
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
          
            if (error) {
                setMessage(error.message);
                // setEmail("");
                // setPassword("");
                return;
              }
          
              if (data) {
                navigate("/profile");
                return null;
              }
           
            console.log(data);
            console.log("Data Submitted")

            console.log(email, password)
        } catch (err) {
             console.log(err)
        //   setError('Invalid email or password');
        }
      };


    return (
        <div className="Login-page">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button type="submit"> Login </button>
                {message && <span>{message}</span>}

            </form>
        </div>
    );
}