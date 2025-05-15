import React from 'react';
import './ListingBox.css';  // Ensure you have a Listing.css file for styling
import { Link } from 'react-router-dom';
import supabase from '../supabase-client';

const ListingBox = ({
  id,
  image,
  name,
  neighborhood,
  phone,
  address,
  liked,
  onLike,
  pricemin,
  pricehigh
}) => {


    const handleSaveApartment = async (e) => {
    e.preventDefault(); // prevent Link navigation

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.id) {
        throw new Error("User not logged in.");
      }

      const userId = userData.user.id;

      // Get current metadata
      const currentSaved = userData.user.user_metadata?.saved_apartments || [];

      // Avoid duplicates
      const updatedSaved = currentSaved.includes(id)
        ? currentSaved
        : [...currentSaved, id];

      const { error: updateError } = await supabase.auth.updateUser({
        data: { saved_apartments: updatedSaved }
      });

      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      } else {
        console.log("Apartment saved successfully!");
        onLike(); // optional: update UI state
      }
    } catch (err) {
      console.error("Error saving apartment:", err.message);
      alert("You must be logged in to save apartments.");
    }
  };

  return (
    <Link to={`/apartment/${id}`} className="listing-link">
      <div className="image-card">
        <div
          className="image-container"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div
            className="icon-circle"
            onClick={(e) => {
              e.preventDefault(); // so you don’t navigate away
              onLike();
            }}
          >
   
            <img
              src={liked ? "/bookmark-filled.svg" : "/bookmark.svg"}
              alt="Bookmark Icon"
              onClick={handleSaveApartment}
            />
          </div>
        </div>
        <div className="card-text">
          <div className="card-title">
            <div className="apartment-name">{name}</div>
            <div className="rating">
              <img src="/star.svg" alt="rating" className="icon" /> 4.5
            </div>
          </div>

          <div className="location">
            <img src="/location.svg" alt="location" className="icon" />
            {neighborhood}
          </div>

          <div className="price">
            <img src="/dollar-square.svg" alt="Price" className="icon" />
            ${pricemin} – ${pricehigh}
          </div>
{/* 
          <div className="phone">
            <img src="/phone.svg" alt="phone" className="icon" />
            {phone}
          </div>

          <div className="address">{address}</div> */}
        </div>
      </div>
    </Link>
  );
};

export default ListingBox;
