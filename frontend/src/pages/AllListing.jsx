import React, { useState, useEffect } from 'react';
import ListingBox from '../components/ListingBox'; // Import ListingBox component
import FilterBar from '../components/FilterBar';  // Import FilterBar component
import './AllListing.css';  // Ensure you have a Listing.css file for styling

function Listing() {
  const [liked, setLiked] = useState([]); // State to track liked status for each image
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    features: [],
  });


useEffect(() => {
  setLoading(true);

  const isFilterEmpty = filters.features.length === 0;
  const fetchApartments = async () => {
    try {
      const response = await fetch (
        isFilterEmpty
        ? 'http://127.0.0.1:5000/apartments'
        : 'http://127.0.0.1:5000/filter_apartments',
        {
          method: isFilterEmpty ? 'GET' : 'POST',
          headers: { 'Content-Type':'application/json'},
          ...(isFilterEmpty ? {} : {body: JSON.stringify({features: filters.features})}),
        }
      );

      if (!response.ok) throw new Error("No network response");
      const data = await response.json();
      setApartments(data.apartments);


    } catch (err){
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
    fetchApartments();

}, [filters]);  // run this effect whenever selectedFeatures changes

  const handleLike = (index) => {
    setLiked((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];  // Toggle liked status
      return newState;
    });
  };

  return (
    
    <div className="listing-page">
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className='listing-body'>
      <h1>All Listings Page</h1>
      
      {/* Render the FilterBar */}
      {/* <div className='filter-section'>
        <FilterBar />
      </div> */}
      {/* Sample ListingBox */}
      <div className="listing-container">
        {apartments
  .filter(item => item.apartment && item.apartment.neighborhood)
  .map((item, index) => (
    <ListingBox
      key={item.apartment.id}
      id={item.apartment.id}
      neighborhood={item.apartment.neighborhood}
      image={item.apartment.photo}
      name={item.apartment.name}
      phone={item.apartment.phoneNumber}
      address={item.apartment.shortAddress}
      liked={liked[index]}
      pricemin={item.price?.min_price ?? "N/A"}
      pricehigh={item.price?.max_price ?? "N/A"}
      onLike={() => handleLike(index)}
    />
))}


      </div>
      </div>
    </div>
  );
}

export default Listing;