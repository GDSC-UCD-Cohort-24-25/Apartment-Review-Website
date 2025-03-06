import React from 'react';

const ListingBox = ({ image, description, liked, onLike , phone,address }) => {
    console.log("Rendering ImageBox:", image, description);
    return (
      <div className="image-card">
        <div className="image-container">
          <img src={image} alt={description} />
          <span className="heart-icon" onClick={onLike}>
            {liked ? '❤️' : '🤍'}
          </span>
        </div>
        <h3>{description}</h3>
        <p>{phone}</p>
        <p>{address}</p>
      </div>
    );
  };
  
  export default ListingBox;
