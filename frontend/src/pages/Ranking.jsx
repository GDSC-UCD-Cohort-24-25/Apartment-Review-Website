// src/pages/Ranking.jsx

import React, { useState, useEffect } from 'react';
import RankingBox from '../components/RankingBox';
import { useApartments } from "../ApartmentProvider";

import './Home.css';    // brings in .listing-container, .image-card, etc.

const Ranking = () => {
  const { apartments, loading } = useApartments();
  
  return (
    <div className="home-container">
      <main className="content">
      <div>
        <h2>Rankings</h2>
        <div className="ranking-container">
        {apartments?.filter(item => item?.apartment?.neighborhood != null)
          .sort((a, b) => b.sentiment_score - a.sentiment_score) // highest sentiment first
          .slice()
          .map((item, key) => 
            <RankingBox key={item.apartment.id} apt={item} ranking={key+1}/>  
        )}        
        </div>
      </div>
      </main>
    </div>
  );
};

export default Ranking;