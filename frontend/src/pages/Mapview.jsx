import React, { useState, useEffect } from 'react';
import './Mapview.css';
import ListingBox from '../components/ListingBox';
const Map = () => {
  const [liked, setLiked] = useState([false, false]);
  const [map, setMap] = useState(null);

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
        {['apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg', 'apartments/almondwood/almondwood-apartments-20200519-064.jpg', 'apartments/sycamorelane/RB209244_HDR_Edit(20220221215739348).jpg'].map((image, index) => (
            <ListingBox
              key={index + 3}  // Offset index to avoid duplicate keys
              image={image}
              description={`Description of High Rated Image ${index + 1}`}
              liked={liked[index + 3]}
              onLike={() => handleLike(index + 3)}
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