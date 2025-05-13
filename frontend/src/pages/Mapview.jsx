import React, { useState, useEffect } from 'react';
import './Mapview.css';
import ListingBox from '../components/ListingBox';
const Map = () => {
  const [liked, setLiked] = useState([false, false]);
  const [map, setMap] = useState(null);
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

  useEffect(() => {
    const initMap = () => {
      new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 38.5449, lng: -121.7405 },
        zoom: 14,
        disableDefaultUI: true,
        styles: [] // Optional: Add custom map styles
      });
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error('Error loading Google Maps script');
      };
      document.head.appendChild(script);
      window.initMap = initMap;
    } else {
      initMap();
    }
  }, []);

  return (
    <div className="map-main-content">
      {/* Listings */}
      <div className="map-listings">
        <h2>Map View</h2>
        <div className="listing-container">
        {apartments.slice(0,15).map((apartment, index) => (
          <ListingBox
          key={apartment.id}

            id={apartment.id}
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

      {/* Google Map */}
      <div id="map" className="map-map"></div>
    </div>
  );
};

export default Map;