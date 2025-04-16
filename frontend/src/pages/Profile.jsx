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

  const profileSections = [
    {
      title: "Edit Profile",
      description: "Update your personal information, add a bio, and change your profile photo.",
    },
    {
      title: "Saved Apartments",
      description: "View and manage all the apartments you've bookmarked while browsing.",
    },
    {
      title: "Your Matches",
      description: "See apartment listings that align with your preferences and lifestyle.",
    },
    {
      title: "Delete Account",
      description: "Permanently remove your profile and all associated data from our system.",
    },
  ];

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
          {profileSections.map((section, index) => (
            <div key={index} className="info-box">
                <h3>{section.title}</h3>
                <p>{section.description}</p>
            </div>
           ))}
          </div>
        </div>
      </ProfileAuth>
    </div>
  );
};

export default Profile;
