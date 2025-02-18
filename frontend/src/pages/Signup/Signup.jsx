
import { useState } from "react";
import supabase from "../../supabase-client";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
    
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        console.log(data)
        if (error) {
            setMessage(error.message);
            return;
        }
    
        if (data) {
            setMessage("User account created!");
        }
    
        setEmail("");
        setPassword("");
    };    
    return (
        <div className="Signup-page">
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Create Account</button>
                {message && <span>{message}</span>}

            </form>        
        </div>
    );
}