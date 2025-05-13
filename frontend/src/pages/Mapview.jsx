// src/pages/Mapview.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mapview.css';
import ListingBox from '../components/ListingBox';

const Map = () => {
  const [apartments, setApartments] = useState([]);
  const [liked, setLiked] = useState([]);
  const navigate = useNavigate();

  // Fetch apartments
  useEffect(() => {
    fetch('http://127.0.0.1:5000/apartments')
      .then(res => res.json())
      .then(({ apartments }) => {
        setApartments(apartments);
        setLiked(new Array(apartments.length).fill(false));
      })
      .catch(err => console.error('Failed to fetch apartments:', err));
  }, []);

  // Initialize map and markers showing apartment names
  useEffect(() => {
    if (!apartments.length) return;

    const initMap = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById('map'),
        {
          center: { lat: 38.5449, lng: -121.7405 },
          zoom: 14,
          disableDefaultUI: true,
        }
      );

      apartments.forEach(apt => {
        // Validate coordinates
        if (apt.latitude == null || apt.longitude == null) return;

        // Create marker with name label
        const marker = new window.google.maps.Marker({
          position: { lat: apt.latitude, lng: apt.longitude },
          map: mapInstance,
          title: apt.name, // hover shows name
          label: {
            text: apt.name,
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '12px'
          }
        });

        // Navigate on click
        marker.addListener('click', () => navigate(`/apartments/${apt.id}`));
      });
    };

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
  }, [apartments, navigate]);

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
