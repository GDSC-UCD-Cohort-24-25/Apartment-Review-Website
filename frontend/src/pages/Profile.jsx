import React, { useEffect, useState, useRef } from 'react';
import supabase from '../supabase-client';
import { useParams } from 'react-router-dom';
import ListingBox from '../components/ListingBox';
import './Profile.css';

const getImageUrl = (filename) =>
  `https://xyz.supabase.co/storage/v1/object/public/apartment_photos/${filename}`;

const Profile = () => {
  const [username, setUsername] = useState('Aggie');
  const [handle, setHandle] = useState('davisStudent');
  const [profileUrl, setProfileUrl] = useState('/moovein.png');
  const [uploading, setUploading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const { userId } = useParams();
  const fileInputRef = useRef(null);
  const [apartments, setApartments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (editingProfile) {
      setNewUsername(username);
      setNewHandle(handle);
    }
  }, [editingProfile, username, handle]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('profilepics_url, username, handle')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        if (data.profilepics_url) setProfileUrl(data.profilepics_url);
        if (data.username) setUsername(data.username);
        if (data.handle) setHandle(data.handle);
      }
    };
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const fetchApartments = async () => {
      const { data, error } = await supabase.from('apartments').select('*');
      if (error) {
        console.error('Error fetching apartments:', error.message);
        return;
      }
      setApartments(data);
    };
    fetchApartments();
  }, []);

  const handleHeartClick = () => {
    setIsLiked(!isLiked);
  };

  const handleUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // Simulate upload by creating a local URL for the image
      const fileUrl = URL.createObjectURL(file);

      setProfileUrl(fileUrl);
    } catch (error) {
      console.error('Error in upload process:', error);
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
  };
  
  
  
  return (
    <div className="profile-page">
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
                  <button onClick={handleSaveProfile} className="save-button">Save</button>
                  <button onClick={() => setEditingProfile(false)} className="cancel-button">Cancel</button>
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

            {/* Heart icon */}
            <div className="heart-container">
              <span
                onClick={handleHeartClick}
                className={`heart-icon ${isLiked ? 'liked' : 'not-liked'}`}
              >
                {isLiked ? '❤️' : '🤍'} {/* Change emoji based on liked state */}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-page">
          <h3>Your Matches</h3>
          <div className="listing-scroll-wrapper">
          <div className="listing-container">
            {apartments.slice(0,15).map((apartment, index) => (
              <ListingBox
              key={apartment.id}

                id={apartment.id}
                image={apartment.photo}
                description={apartment.name}
                phone = {apartment.phoneNumber}
                address = {apartment.shortAddress}
                              />
            ))}
            </div>
          </div>

          <h3>Saved Apartments</h3>
          <div className="saved-apartments-container">
          <div className="listing-container">
          {apartments.slice(0,15).map((apartment, index) => (
            <ListingBox
            key={apartment.id}

              id={apartment.id}
              image={apartment.photo}
              description={apartment.name}
              phone = {apartment.phoneNumber}
              address = {apartment.shortAddress}
            />
          ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
