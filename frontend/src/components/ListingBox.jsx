import React from 'react';

const ListingBox = ({ image, description, liked, onLike , phone,address }) => {
    return (
      <div className="image-card">
        <div className="image-container" style={{backgroundImage: `url(${image})`}}>
          <span className="heart-icon" onClick={onLike}>
            {liked ? '❤️' : '🤍'}
          </span>
        </div>
        <div className='image-card-text'>
        <h3>{description}</h3>
        <p>{phone}</p>
        <p>{address}</p>
        </div>
      </div>
    );
  };
  
  export default ListingBox;
