// src/pages/Ranking.jsx
import React, { useState, useEffect } from 'react';
import ListingBox from '../components/ListingBox';
import './Home.css';

const apartmentData = {
  apt1: {
    photo:
      'apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg',
    name: 'The Drake & Anderson',
    // you can add phoneNumber, shortAddress here if you like
  },
  apt2: {
    photo: 'apartments/almondwood/almondwood-apartments-20200519-064.jpg',
    name: 'Almondwood',
  },
  apt3: {
    photo:
      'apartments/sycamorelane/RB209244_HDR_Edit(20220221215739348).jpg',
    name: 'Sycamore Lane',
  },
};

const Ranking = () => {
  const [rankings, setRankings] = useState([]);
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/rankings')
      .then(res => res.json())
      .then(data => {
        const ids = Array.isArray(data) && data.length
          ? data
          : ['apt1','apt2','apt3'];
        setRankings(ids);
        setLiked(new Array(ids.length).fill(false));
      })
      .catch(() => {
        const fallback = ['apt1','apt2','apt3'];
        setRankings(fallback);
        setLiked(new Array(fallback.length).fill(false));
      });
  }, []);

  const handleLike = index => {
    setLiked(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const featured = rankings.slice(0, 3);
  const highRated = rankings.slice(3, 6);

  return (
    <div className="home-container">
      <main className="content">
        {/* Featured Section */}
        <div>
          <h2>Featured</h2>
          <div className="listing-container">
            {featured.map((aptId, idx) => {
              const apt = apartmentData[aptId] || {};
              return (
                <ListingBox
                  key={aptId}
                  image={apt.photo}
                  description={apt.name}
                  liked={liked[idx]}
                  onLike={() => handleLike(idx)}
                />
              );
            })}
          </div>
        </div>

        {/* High Rated Section */}
        <div>
          <h2>High Rated</h2>
          <div className="listing-container">
            {highRated.map((aptId, idx) => {
              const overall = idx + featured.length;
              const apt = apartmentData[aptId] || {};
              return (
                <ListingBox
                  key={aptId}
                  image={apt.photo}
                  description={apt.name}
                  liked={liked[overall]}
                  onLike={() => handleLike(overall)}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ranking;
