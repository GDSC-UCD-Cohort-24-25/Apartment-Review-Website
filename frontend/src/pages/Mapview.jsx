import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";  // ← add this
import './Mapview.css';
import ListingBox from '../components/ListingBox';
import { useApartments } from "../ApartmentProvider";

const Map = () => {
  const { apartments, loading } = useApartments();
  const navigate = useNavigate();

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

      apartments.forEach(item => {
        if (item.apartment.latitude == null || item.apartment.longitude == null) return;
        const display = item.price?.min_price != null
              ? `$${item.price.min_price}`
              : "N/A"
        const marker = new window.google.maps.Marker({
          position: { lat: item.apartment.latitude, lng: item.apartment.longitude },
          map: mapInstance,
          title: item.apartment.name,
          icon: {
            url: "/map-marker.png", // Custom blue icon
            scaledSize: new window.google.maps.Size(30, 40), // optional resize
            labelOrigin: new google.maps.Point(15, 15)         // Move label 8px down from icon top

          },
          glyphPosition: '0px 50px',
          label: {
            text: display,
            color: '##313638',
            fontWeight: '400',
            fontSize: '16px',
            fontFamily: 'inter'
          }
        });

        marker.addListener('click', () => navigate(`/apartment/${item.apartment.id}`));
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

  return (
    <div className="map-main-content">
      <div className="map-listings">
        <h2>All Apartments</h2>
        <div className="listing-container">
        {loading ?
          <p>Loading apartments...</p>:
          apartments.filter(i=>i.apartment.neighborhood!==null).map((item) => <ListingBox key={item.apartment.id} apt={item}/>)
        }        
        </div>
      </div>
      {/* Google Map */}
      <div id="map" className="map-map"></div>
    </div>
  );
};

export default Map;
