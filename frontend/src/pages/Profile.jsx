import React, { useEffect, useState, useRef } from "react";
import supabase from "../supabase-client";
import { useParams } from "react-router-dom";
import ProfileAuth from "../components/ProfileAuth";
import "./Profile.css";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("Aggie");
  const [handle, setHandle] = useState("davisStudent");
  const [profileUrl, setProfileUrl] = useState("/default.jpg");
  const [uploading, setUploading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newHandle, setNewHandle] = useState("");

  const { userId } = useParams();
  const fileInputRef = useRef(null);

  // Initialize form values when opening edit mode
  useEffect(() => {
    if (editingProfile) {
      setNewUsername(username);
      setNewHandle(handle);
    }
  }, [editingProfile, username, handle]);

  // Fetch user session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setEmail(session.user.email);
      }
    };
    getSession();
  }, []);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("profilepics_url")
        .eq("id", userId)
        .single();

      if (data?.profilepics_url) {
        setProfileUrl(data.profilepics_url);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !userId) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profilepics")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("profilepics")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error("Failed to get public URL");

      const finalUrl = `${publicUrl}?t=${Date.now()}`;
      setProfileUrl(finalUrl);

      await supabase
        .from("profiles")
        .update({ profilepics_url: finalUrl })
        .eq("id", userId);

      alert("Profile picture updated successfully!");
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEditPicture = () => {
    fileInputRef.current.click();
  };

  const handleSaveProfile = () => {
    setUsername(newUsername);
    setHandle(newHandle);
    setEditingProfile(false);

    // Here you would typically save to the database as well
    // For example:
    // saveToDB({ username: newUsername, handle: newHandle });
  };

  const mockApartments = [
    {
      name: "Sundance Apartments",
      location: "West Davis Manor",
      price: "$650/month",
      rating: 4.5,
      image: "/apt1.jpg"
    },
    {
      name: "Almondwood Apartment",
      location: "West Davis Manor",
      price: "$650/month",
      rating: 4.5,
      image: "/apt2.jpg"
    },
    {
      name: "The Drake",
      location: "West Davis Manor",
      price: "$650/month",
      rating: 4.5,
      image: "/apt3.jpg"
    },
    {
      name: "Another Apartment",
      location: "Some Other Place",
      price: "$700/month",
      rating: 4.0,
      image: "/apt1.jpg"
    },
    {
      name: "Yet Another Place",
      location: "Far Away",
      price: "$800/month",
      rating: 3.5,
      image: "/apt2.jpg"
    }
  ];

  const ApartmentCard = ({ apt }) => (
    <div className="apartment-card">
      <img src={apt.image} alt={apt.name} />
      <h4>{apt.name}</h4>
      <p>{apt.location}</p>
      <p>{apt.price}</p>
      <p>⭐ {apt.rating}</p>
    </div>
  );

  return (
    <div className="profile-page">
      <ProfileAuth>
        <div className="profile-header">
          <h2>Welcome</h2>
        </div>
        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="profile-image-container">
              <div className="profile-img-wrapper">
                <img src={profileUrl} alt="Profile" className="profile-img" />
                <div className="image-overlay" onClick={handleEditPicture}>
                  <span className="change-photo-text">Change Photo</span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              {uploading && <p>Uploading...</p>}
            </div>

            <div className="profile-info">
              {editingProfile ? (
                <div className="edit-profile-form">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Name"
                    className="profile-input"
                  />
                  <input
                    type="text"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="Username"
                    className="profile-input"
                  />
                  <div className="edit-buttons">
                    <button onClick={handleSaveProfile} className="save-button">
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2>{username}</h2>
                  <p className="handle">@{handle}</p>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="edit-profile-button"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="profile-main">
            <h3>Your Matches</h3>
            <div className="apartment-list-horizontal-scroll">
              {mockApartments.map((apt, idx) => (
                <div className="apartment-card">
                  <img src={apt.image} alt={apt.name} />
                  <h4>{apt.name}</h4>
                  <p>{apt.location}</p>
                  <p>{apt.price}</p>
                  <p>⭐ {apt.rating}</p>
                </div>
              ))}
            </div>

            <h3>Saved Apartments</h3>
            <div className="saved-apartments-container">
              <div className="apartment-vertical-grid">
                {mockApartments.map((apt, idx) => (
                  <div className="apartment-card">
                    <img src={apt.image} alt={apt.name} />
                    <h4>{apt.name}</h4>
                    <p>{apt.location}</p>
                    <p>{apt.price}</p>
                    <p>⭐ {apt.rating}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProfileAuth>
    </div>
  );
};

export default Profile;