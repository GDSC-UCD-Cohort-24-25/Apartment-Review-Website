import React, { useState, useEffect } from 'react';
import './Mapview.css';

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
        <div className="image-gallery">
          {[
            {
              image: 'apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg',
              title: 'Drake and Anderson',
              location: 'West Davis Manor',
              price: '650/month',
              rating: 4.5
            },
            {
              image: 'apartments/almondwood/almondwood-apartments-20200519-064.jpg',
              title: 'Almond Apartments',
              location: 'West Davis Manor',
              price: '650/month',
              rating: 4.5
            },
            {
              image: 'apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg',
              title: 'Drake and Anderson Court',
              location: 'West Davis Manor',
              price: '650/month',
              rating: 4.5
            }
          ].map((listing, index) => (
            <div key={index} className="image-card">
              <div className="image-container">
                <img src={listing.image} alt={listing.title} />
                <span
                  className={`heart-icon ${liked[index] ? 'liked' : ''}`}
                  onClick={() => handleLike(index)}
                >
                  ♥
                </span>
              </div>
              <div className="listing-info">
                <h3>{listing.title}</h3>
                <p>{listing.location}</p>
                <p>{listing.price}</p>
                <div className="map-rating">
                  <i className="fas fa-star"></i> {listing.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Map */}
      <div id="map" className="map-map"></div>
    </div>
  );
};

export default Map;