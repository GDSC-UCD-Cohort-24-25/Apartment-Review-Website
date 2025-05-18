import React, { useEffect, useState, useRef } from 'react';
import supabase from '../supabase-client';
import { useParams , useNavigate} from 'react-router-dom';
import ListingBox from '../components/ListingBox';
import { useAuth } from "../Auth";
import { useApartments } from "../ApartmentProvider";

import './Profile.css';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [handle, setHandle] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const fileInputRef = useRef(null);
  const { user , loading: authLoading} = useAuth();
  const { apartments, loading } = useApartments();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setUsername(user.user_metadata.name);
    setHandle(user.user_metadata.handle);
    setProfileUrl(user.user_metadata.avatar_url);
  }, [user]);
 
  useEffect(() => {
    if (editingProfile) {
      setNewUsername(username);
      setNewHandle(handle);
    }
  }, [editingProfile, username, handle]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);
  
const handleUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file || !user) return;

  setUploading(true);
  try {
    const userId = user.id;
    const filePath = `avatars/${userId}.jpg`; // force .jpg for upsert

    // 1. Upload
    const { error: uploadError } = await supabase.storage
      .from("profilepics")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (uploadError) throw uploadError;

    // 2. Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("profilepics").getPublicUrl(filePath);

    // 3. Bust the cache by appending a timestamp
    const urlWithBuster = `${publicUrl}?t=${Date.now()}`;

    // 4. Immediately update local state so React re-renders
    setProfileUrl(urlWithBuster);

    // 5. Persist to Supabase auth metadata (so other sessions/components see it)
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });
    if (updateError) console.error("Metadata update failed:", updateError);

    // 6. If your Auth context has a revalidation method, call it here:
    //    e.g. await refreshUser(); 
    //    so that useAuth() elsewhere picks up the new avatar_url
  } catch (err) {
    console.error("Upload error:", err);
    alert(`Upload failed: ${err.message}`);
  } finally {
    setUploading(false);
  }
};

  const handleEditPicture = () => {
    fileInputRef.current.click();
  };

  const handleSaveProfile = async () => {
    setUsername(newUsername);
    setHandle(newHandle);
    const { newData, newError } = await supabase.auth.updateUser({
      data: { name: newUsername, handle: newHandle }
    })    
    setEditingProfile(false);
  };
    
  const handleLogout = async () => {
      await supabase.auth.signOut()
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
      <h2>Welcome</h2>
          <div className="profile-img-wrapper">
            <img
              src={
                profileUrl
                  ? profileUrl
                  : `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(username)}`
              }
              alt="Profile"
              className="profile-img"
            />              
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
                  <button onClick={handleSaveProfile} className="primary">Save</button>
                  <button onClick={() => setEditingProfile(false)} className="secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h3>{username}</h3>
                <p className="handle">{handle}</p>
                <button onClick={() => navigate('/quiz')} className="primary">Take Quiz</button>
                <button onClick={() => setEditingProfile(true)} className="secondary">Edit Profile</button>
                <button className="secondary" onClick={() => handleLogout()}>Logout</button>
              </>
            )}
        </div>
      </div>

      <div className="profile-apartment">
        <h3>Your Matches</h3>
        <div className="listing-scroll-wrapper">
        <div className="listing-container apartment-matches">
          {loading ?
            <p>Loading apartments...</p>:
            apartments.filter(i=>i.apartment.neighborhood!==null).slice(0,5).map((item) => <ListingBox key={item.apartment.id} apt={item}/>)
          }
          </div>
        </div>
        <h3>Saved Apartments</h3>
        <div className="saved-apartments-container">
          <div className="listing-container">
          {loading || authLoading?
            <p>Loading apartments...</p>:
            apartments.filter(i=>user.user_metadata.saved_apartments.includes(i.apartment.id)).map(
              (item) => <ListingBox key={item.apartment.id} apt={item}/>
            )
          }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
