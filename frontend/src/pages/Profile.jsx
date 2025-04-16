import React, { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { useParams } from "react-router-dom";
import ProfileAuth from "../components/ProfileAuth";
import "./Profile.css"; // Import CSS

const Profile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("Katherine");
  const [handle, setHandle] = useState("bigbackmelody");
  const { userId } = useParams();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setEmail(session.user.email);
    };
    getSession();
  }, []);

  return (
    <div className="profile-page">
      <ProfileAuth>
        <h2 className="welcome-heading">Welcome!</h2>

        <div className="profile-content">
          {/* Left: Profile Image & Info */}
          <div className="profile-left">
            <img
              src="/default.jpg"
              alt="Profile"
              className="profile-img"
            />
            <h2 className="username">{username}</h2>
            <p className="handle">@{handle}</p>
          </div>

          {/* Right: Info Boxes */}
          <div className="profile-right">
            {[
              "Edit Profile",
              "Saved Apartments",
              "Your Matches",
              "Delete Account",
            ].map((title, index) => (
              <div key={index} className="info-box">
                <h3>{title}</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Nunc molestie a in
                  dictum rutrum donec turpis lacinia. Nibh turpis dui ultrices eu
                  feugiat sapien. Dui at blandit netus.
                </p>
              </div>
            ))}
          </div>
        </div>
      </ProfileAuth>
    </div>
  );
};

export default Profile;
