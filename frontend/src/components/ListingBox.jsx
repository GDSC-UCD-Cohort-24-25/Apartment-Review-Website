import React from 'react';
import './ListingBox.css';  // Ensure you have a Listing.css file for styling


const ListingBox = ({ image, description, liked, onLike , phone,address }) => {
    return (
      <div className="image-card">
        <div className="image-container" style={{backgroundImage: `url(${image})`}}>
          <span className="heart-icon" onClick={onLike}>
            {liked ? '❤️' : '🤍'}
          </span>
        </div>
        <div className='card-text'>
        <h3>{description}</h3>
        <p>{phone}</p>
        <p>{address}</p>
        </div>
      </div>
    );
  };
  
  export default ListingBox;
