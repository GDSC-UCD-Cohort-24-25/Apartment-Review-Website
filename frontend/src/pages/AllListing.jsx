import React, { useState } from 'react';
import ListingBox from '../components/ListingBox'; // Import ListingBox component
import FilterBar from '../components/FilterBar';  // Import FilterBar component
import './AllListing.css';  // Ensure you have a Listing.css file for styling

function Listing() {
  const [liked, setLiked] = useState([false, false, false]); // State to track liked status for each image

  const handleLike = (index) => {
    setLiked((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];  // Toggle liked status
      return newState;
    });
  };

  return (
    
    <div className="listing-page">
        <FilterBar />
      <div className='listing-body'>
      <h1>All Listings Page</h1>
      
      {/* Render the FilterBar */}
      {/* <div className='filter-section'>
        <FilterBar />
      </div> */}
      {/* Sample ListingBox */}
      <div className="listing-container">
        {['apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg', 
          'apartments/almondwood/almondwood-apartments-20200519-064.jpg', 
          'apartments/sycamorelane/RB209244_HDR_Edit(20220221215739348).jpg'].map((image, index) => (
          <ListingBox
            key={index}  // Ensure each ListingBox has a unique key
            image={image}
            description={`Description of Listing ${index + 1}`}
            liked={liked[index]}
            onLike={() => handleLike(index)}  // Pass the correct index for each ListingBox
          />
        ))}
      </div>
      </div>
    </div>
  );
}

export default Listing;
