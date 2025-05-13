import React from 'react';
import './ListingBox.css';  // Ensure you have a Listing.css file for styling
import { Link } from 'react-router-dom';
import DollarIcon from '../../public/dollar-square.svg';


const ListingBox = ({id, image, description, liked, onLike , phone,address }) => {
  return (
    <Link to={`/apartment/${id}`} className="listing-link">
      <div className="image-card" key={id}>
        <div className="image-container" style={{ backgroundImage: `url(${image})` }}>
          <div className="icon-circle">
            <img src="/bookmark.svg" alt="Bookmark Icon" />
          </div>
        </div>
        <div className="card-text">
          <div className="card-title">
            <div className="apartment-name">{description}</div>
            <div className="rating">
              <img src="/star.svg" alt="rating" className="icon" /> 4.5
            </div>
          </div>
          <div className="location">
            <img src="/location.svg" alt="location" className="icon" />
            {phone}
          </div>
          <div className="price">
            <img src={DollarIcon} alt="price" className="icon" />
            {address}
          </div>
        </div>
      </div>
    </Link>
  );
  };
  
  export default ListingBox;
