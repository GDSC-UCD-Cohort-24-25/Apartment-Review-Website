import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "./supabase-client";

const ProfileAuth = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const { userid } = useParams(); // Get userId from URL

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) setAuthenticated(false);
            setAuthenticated(session.user.id === userid);   
            setLoading(false);
        };
        getSession();
    }, []);

    if (loading) { return <h1>Loading...</h1>; }
    if (authenticated) { return <>{children}</>; }
    return <h1>No permission to view this profile</h1>;
}

export default ProfileAuth;