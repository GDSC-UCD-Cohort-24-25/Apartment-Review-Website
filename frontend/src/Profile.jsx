import ProfileAuth from "./ProfileAuth";
import React, { useEffect, useState } from "react";
import supabase from "./supabase-client";
import { useParams } from "react-router-dom";

const Profile = () => {
    const [email, setEmail] = useState("");
    const { userId } = useParams(); // Get userId from URL

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            setEmail(session.user.email)
        };
        getSession();
    }, []);

    return (
        <div className="profile-page">
            <ProfileAuth>
                <h1>Profile Page</h1>
                <p>Logged in as {email}</p>
            </ProfileAuth>
        </div>
    );
}

export default Profile;
