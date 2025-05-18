// src/pages/Ranking.jsx

import React, { useState, useEffect } from 'react';
import ListingBox from '../components/ListingBox';
import { useApartments } from "../ApartmentProvider";

import './Home.css';    // brings in .listing-container, .image-card, etc.

const Ranking = () => {
  const { apartments, loading } = useApartments();
  
  return (
    <div className="home-container">
      <main className="content">
      <div>
        <h2>Rankings</h2>
        <div className="listing-container">
        {apartments?.filter(item => item?.apartment?.neighborhood != null)
          .sort((a, b) => b.sentiment_score - a.sentiment_score) // highest sentiment first
          .slice()
          .map((item) => 
            <ListingBox key={item.apartment.id} apt={item}/>  
        )}        
        </div>
      </div>
      </main>
    </div>
  );
};

export default Ranking;