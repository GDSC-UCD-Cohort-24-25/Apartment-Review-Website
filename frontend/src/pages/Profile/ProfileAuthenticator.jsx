import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";
// import { Navigate } from "react-router-dom";

function ProfileAuthenticator({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setAuthenticated(!!session);
            setLoading(false);
        };
        getSession();
    }, []);

    if (loading) { return <div>Loading...</div>; }
    if (authenticated) { return <>{children}</>; }
    return <div>Unauthenticated</div>;
    // return <Navigate to="/login" />;
}

export default ProfileAuthenticator ;