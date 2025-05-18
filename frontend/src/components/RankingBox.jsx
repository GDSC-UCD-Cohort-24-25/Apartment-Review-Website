import React, { useState, useEffect } from 'react';
import './RankingBox.css';  // Ensure you have a Listing.css file for styling
import { Link } from 'react-router-dom';
import supabase from '../supabase-client';
import { useAuth } from "../Auth";

const RankingBox = ({ apt , ranking}) => {
  const [liked, setLiked] = useState(false); // local state
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const saved = user.user_metadata?.saved_apartments || [];
      setLiked(saved.includes(apt.apartment.id));
    }
  }, [loading, user, apt.apartment.id]);

  const handleSaveApartment = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    if (!user) {
      alert("You must be logged in to save apartments.");
      return;
    }

    const aptId = apt.apartment.id;
    const currentSaved = user.user_metadata?.saved_apartments || [];

    // Toggle logic: add if missing, remove if already there
    const isSaved = currentSaved.includes(aptId);
    const updatedSaved = isSaved
      ? currentSaved.filter(id => id !== aptId)
      : [...currentSaved, aptId];

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { saved_apartments: updatedSaved }
      });

      if (updateError) throw updateError;

      setLiked(!isSaved);
    } catch (err) {
      console.error("Error updating saved apartments:", err);
      alert("There was a problem saving this apartment.");
    }
  };

  return (
    <Link to={`/apartment/${apt.apartment.id}`} className="listing-link">
      <div className="ranking-image-card">
        <div
          className="image-container"
          style={{ backgroundImage: `url(${apt.apartment.photo})` }}
        >
          <div className="icon-circle" onClick={handleSaveApartment}>
            <img
              src={liked ? "/bookmark-filled.svg" : "/bookmark.svg"}
              alt="Bookmark Icon"
              onClick={handleSaveApartment}
            />
          </div>
        </div>
        <div className="card-text">
          <div className="card-title">
            <div className="apartment-name">#{ranking}{" - "}{apt.apartment.name}</div>
            <div className="rating">
              <img src="/star.svg" alt="rating" className="icon" />{apt.avg_rating===-1? "N/A":apt.avg_rating}
            </div>
          </div>
        <div className="ranking-sentiment">
            {"Student Sentiment"}{": "}{apt.sentiment_score}
        </div>
          <div className="location">
            <img src="/location.svg" alt="location" className="icon" />
            {apt.apartment.neighborhood}
          </div>

          <div className="price">
            <img src="/dollar-square.svg" alt="Price" className="icon" />
            {apt.price.min_price===0 ? "N/A" : 
              `${apt.price.min_price} – ${apt.price.max_price}`
            }
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RankingBox;
