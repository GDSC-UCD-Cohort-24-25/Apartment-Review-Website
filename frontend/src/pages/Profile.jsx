import React, { useEffect, useState, useRef } from 'react';
import supabase from '../supabase-client';
import { useParams , useNavigate} from 'react-router-dom';
import ListingBox from '../components/ListingBox';
import './Profile.css';

const getImageUrl = (filename) =>
  `https://xyz.supabase.co/storage/v1/object/public/apartment_photos/${filename}`;

const Profile = () => {
  const [username, setUsername] = useState('');
  const [handle, setHandle] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const { userId } = useParams();
  const fileInputRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

    const [apartments, setApartments] = useState([]);
    
    useEffect(() => {
      fetch('http://127.0.0.1:5000/apartments')
        .then(response => response.json())
        .then(data => {
          setApartments(data.apartments);
          setLiked(new Array(data.apartments.length).fill(false));
        })
        .catch(error => console.error('Error fetching apartments:', error));
    }, []);
  
  useEffect(() => {
    if (editingProfile) {
      setNewUsername(username);
      setNewHandle(handle);
    }
  }, [editingProfile, username, handle]);

  useEffect(() => {

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.error("Error fetching user:", error);
        return;
      }

      const user = data.user;
      setUsername(user.user_metadata?.name || '');
      setHandle(user.user_metadata?.handle || 'davisStudent');
      if (user.user_metadata?.avatar_url) {
        setProfileUrl(user.user_metadata.avatar_url);
      }


    };

    fetchUser();
  }, [userId]);




const handleUpload = async (event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    // Get current user info
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.id) {
      throw new Error("Failed to retrieve user.");
    }

    const userId = userData.user.id;
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${userId}.${fileExt}`; // store in a folder for cleanliness

    // Upload to Supabase Storage with upsert
    const { data, error } = await supabase.storage
      .from('profilepics')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl }
    } = supabase.storage.from('profilepics').getPublicUrl(filePath);

    setProfileUrl(publicUrl);

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    });

    if (updateError) console.error("Metadata update error:", updateError);
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
    setUsername(newUsername);
    setHandle(newHandle);
    const { newData, newError } = await supabase.auth.updateUser({
      data: { name: newUsername, handle: newHandle }
    })    
    setEditingProfile(false);

  };
  
  
  const handleLogout = async () => {
      const { error } = await supabase.auth.signOut()
      navigate('/login')
  };

  
  return (
    <div className="profile-page">
      <div class="profile-sidebar">
      <h2>Welcome</h2>
            <div className="profile-img-wrapper">
              <img src={profileUrl==""? "https://ui-avatars.com/api/?background=random&name=" + username: profileUrl} alt="Profile" className="profile-img" />
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
          <div className="listing-container">
          {apartments.filter(item => item.apartment.neighborhood!==null).slice(0,5).map((item, index) => 
            (
              <ListingBox
                key={item.apartment.id}
                id={item.apartment.id}
                neighborhood={item.apartment.neighborhood}
                image={item.apartment.photo}
                name={item.apartment.name}
                phone={item.apartment.phoneNumber}
                address={item.apartment.shortAddress}
                pricemin={item.price?.min_price ?? "N/A"}
                pricehigh={item.price?.max_price ?? "N/A"}
                onLike={() => handleLike(index)}
              />
            )
          )} 
            </div>
          </div>

          <h3>Saved Apartments</h3>
          <div className="saved-apartments-container">
          <div className="listing-container">
          {apartments.filter(item => item.apartment.neighborhood!==null).slice(0,5).map((item, index) => 
            (
              <ListingBox
                key={item.apartment.id}
                id={item.apartment.id}
                neighborhood={item.apartment.neighborhood}
                image={item.apartment.photo}
                name={item.apartment.name}
                phone={item.apartment.phoneNumber}
                address={item.apartment.shortAddress}
                pricemin={item.price?.min_price ?? "N/A"}
                pricehigh={item.price?.max_price ?? "N/A"}
                onLike={() => handleLike(index)}
              />
            )
          )} 
          </div>
          </div>
        </div>
    </div>
  );
};

export default Profile;
