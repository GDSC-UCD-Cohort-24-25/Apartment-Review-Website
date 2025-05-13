// src/pages/Mapview.jsx

import React, { useState, useEffect } from 'react';
import './Mapview.css';
import ListingBox from '../components/ListingBox';

const Map = () => {
  const [apartments, setApartments] = useState([]);
  const [liked, setLiked]         = useState([]);

  // Fetch apartments from main.py
  useEffect(() => {
    fetch('http://127.0.0.1:5000/apartments')
      .then(res => res.json())
      .then(({ apartments }) => {
        setApartments(apartments);
        setLiked(new Array(apartments.length).fill(false));
      })
      .catch(err => console.error('Failed to fetch apartments:', err));
  }, []);

  // Initialize Google Map & place markers
  useEffect(() => {
    if (!apartments.length) return;
    const initMap = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById('map'),
        {
          center: { lat: 38.5449, lng: -121.7405 },
          zoom: 14,
          disableDefaultUI: true,
          styles: []
        }
      );

      apartments.forEach(apt => {
        if (apt.latitude && apt.longitude) {
          new window.google.maps.Marker({
            position: {
              lat: apt.latitude,
              lng: apt.longitude
            },
            map: mapInstance,
            title: apt.name
          });
        }
      });
    };

    // Load Maps script if needed
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [apartments]);

  const handleLike = idx => {
    setLiked(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  return (
    <div className="map-main-content">
      {/* Listings */}
      <div className="map-listings">
        <h2>All Apartments</h2>
        <div className="listing-container">
          {apartments.map((apt, idx) => (
            <ListingBox
              key={apt.id}
              image={apt.photo}
              description={apt.name}
              // if your DB has phoneNumber or shortAddress, swap in apt.phoneNumber / apt.shortAddress
              phone={apt.contact_phone}
              address={apt.website}
              liked={liked[idx]}
              onLike={() => handleLike(idx)}
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
