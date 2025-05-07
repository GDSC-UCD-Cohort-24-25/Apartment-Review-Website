import React, { useEffect, useState, useRef } from 'react';
import supabase from '../supabase-client';
import { useParams } from 'react-router-dom';
import ProfileAuth from '../components/ProfileAuth';
import ListingBox from '../components/ListingBox';
import './Profile.css';

const getImageUrl = (filename) =>
  `https://xyz.supabase.co/storage/v1/object/public/apartment_photos/${filename}`;

const Profile = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('Aggie');
  const [handle, setHandle] = useState('davisStudent');
  const [profileUrl, setProfileUrl] = useState('/default.jpg');
  const [uploading, setUploading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  const { userId } = useParams();
  const fileInputRef = useRef(null);
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    if (editingProfile) {
      setNewUsername(username);
      setNewHandle(handle);
    }
  }, [editingProfile, username, handle]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setEmail(session.user.email);
        setCurrentUserId(session.user.id);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          await supabase.from('profiles').insert({
            id: session.user.id,
            email: session.user.email,
            username: 'Aggie',
            handle: 'davisStudent',
            profilepics_url: '/default.jpg'
          });
        } else if (data) {
          setUsername(data.username || 'Aggie');
          setHandle(data.handle || 'davisStudent');
          if (data.profilepics_url) {
            setProfileUrl(data.profilepics_url);
          }
        }
      }
    };
    getSession();
  }, []);

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

  const handleUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to upload a profile picture.');
        return;
      }

      const userId = session.user.id;
      const userEmail = session.user.email;

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profilepics')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const supabaseUrl = supabase.storage.from('profilepics').getPublicUrl(fileName);
      const publicUrl = supabaseUrl.data.publicUrl;

      if (!publicUrl) throw new Error('Failed to get public URL');

      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .eq('email', userEmail)
        .single();

      if (userError || !userProfile) {
        alert('Your email is not registered. Cannot update profile picture.');
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profilepics_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      setProfileUrl(publicUrl);
      alert('Profile picture updated successfully!');
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

  const handleSaveProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to update your profile.');
        return;
      }

      const userId = session.user.id;
      const userEmail = session.user.email;

      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .eq('email', userEmail)
        .single();

      if (userError || !userProfile) {
        alert('Your email is not registered. Cannot update profile.');
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: newUsername,
          handle: newHandle
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      setUsername(newUsername);
      setHandle(newHandle);
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert(`Profile update failed: ${error.message}`);
    }
  };

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
            </div>
          </div>

          <div className="profile-main">
          <h3>Your Matches</h3>
            <div className="listing-scroll-wrapper">
              <div className="listing-container">
                {apartments.map((apt, index) => (
                  <ListingBox
                    key={index}
                    image={apt.photo}
                    description={apt.name}
                    phone={apt.phoneNumber}
                    address={apt.address}
                    liked={false}
                    onLike={() => {}}
                  />
                ))}
              </div>
            </div>


            <h3>Saved Apartments</h3>
            <div className="saved-apartments-container">
              <div className="listing-container">
                {apartments.map((apt, index) => (
                  <ListingBox
                    key={index}
                    image={apt.photo}
                    description={apt.name}
                    phone={apt.phoneNumber}
                    address={apt.address}
                    liked={false}
                    onLike={() => {}}
                  />
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
