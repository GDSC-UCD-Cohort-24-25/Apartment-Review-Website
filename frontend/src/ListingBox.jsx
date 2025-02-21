import React from 'react';

const ListingBox = ({ image, description, liked, onLike }) => {
    console.log("Rendering ImageBox:", image, description);
    return (
      <div className="image-card">
        <div className="image-container">
          <img src={image} alt={description} />
          <span className="heart-icon" onClick={onLike}>
            {liked ? '❤️' : '🤍'}
          </span>
        </div>
        <p>{description}</p>
      </div>
    );
  };
  
  export default ListingBox;
