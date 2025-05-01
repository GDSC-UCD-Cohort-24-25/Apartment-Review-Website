import React, { useState, useEffect } from 'react';
import ListingBox from '../components/ListingBox'; // Import ListingBox component
import FilterBar from '../components/FilterBar';  // Import FilterBar component
import './AllListing.css';  // Ensure you have a Listing.css file for styling

function Listing() {
  const [liked, setLiked] = useState([false, false, false]); // State to track liked status for each image
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
      {apartments.slice(0,15).map((apartment, index) => (
          <ListingBox
            key={apartment.id}
            image={apartment.photo}
            description={apartment.name}
            phone = {apartment.phoneNumber}
            address = {apartment.shortAddress}
            liked={liked[index]}
            onLike={() => handleLike(index)}
          />
        ))}
      </div>
      </div>
    </div>
  );
}

export default Listing;