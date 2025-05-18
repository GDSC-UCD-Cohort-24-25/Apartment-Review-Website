import React, { useState, useEffect } from 'react';
import ListingBox from '../components/ListingBox'; // Import ListingBox component
import FilterBar from '../components/FilterBar';  // Import FilterBar component
import './AllListing.css';  // Ensure you have a Listing.css file for styling
import { useApartments } from "../ApartmentProvider";

function Listing() {
  const { apartments, loading } = useApartments();

  return ( 
    <div className="listing-page">
      <FilterBar />
      <div className='listing-body'>
      <h1>All Listings</h1>
      <div className="listing-container">
        {loading ?
          <p>Loading apartments...</p>:
          apartments.map((item) => <ListingBox key={item.apartment.id} apt={item}/>)
        }      
        </div>
      </div>
    </div>
  );
}

export default Listing;