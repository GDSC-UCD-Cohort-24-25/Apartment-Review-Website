// src/pages/Ranking.jsx

import React, { useState, useEffect } from 'react';
import ListingBox from '../components/ListingBox';
import './Home.css';    // brings in .listing-container, .image-card, etc.

const Ranking = () => {
  const [liked, setLiked]         = useState([]);
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/rankings')
      .then(res => {
        console.log('FETCH /rankings status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('FETCH /rankings body:', data);
        setApartments(data);
        setLiked(new Array(data.length).fill(false));
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div className="home-container">
      <main className="content">

        <div>
          <h2>Top Apartments</h2>
          <div className="listing-container">
            {apartments.slice(0, 5).map((apt, idx) => (
              <ListingBox
                key={apt.id}
                image={apt.photo}
                description={apt.name}
                phone={apt.phoneNumber}
                address={apt.shortAddress}
                liked={liked[idx]}
                onLike={() => handleLike(idx)}
              />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Ranking;