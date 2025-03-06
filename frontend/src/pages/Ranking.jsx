import React, { useState } from 'react';
import './Ranking.css';

const Ranking = () => {
  const [liked, setLiked] = useState([false, false, false, false, false, false]);

  const handleLike = (index) => {
    setLiked((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="ranking-container">
      <main className="ranking-content">
        <div>
          <h2>Top Ranked</h2>
          <div className="ranking-image-gallery">
            {['apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg', 
            'apartments/almondwood/almondwood-apartments-20200519-064.jpg', 
            'apartments/sycamorelane/RB209244_HDR_Edit(20220221215739348).jpg'].map((image, index) => (
              <div key={index} className="ranking-listing-box">
                <img src={image} alt={`Top Ranked Image ${index + 1}`} className="ranking-listing-image" />
                <span
                  className={`ranking-heart-icon ${liked[index] ? 'liked' : ''}`}
                  onClick={() => handleLike(index)}
                >
                  ♥
                </span>
                <div className="ranking-listing-description">
                  <p>Description of Top Ranked Image {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>Most Popular</h2>
          <div className="ranking-image-gallery">
            {['apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg', 
            'apartments/almondwood/almondwood-apartments-20200519-064.jpg', 
            'apartments/sycamorelane/RB209244_HDR_Edit(20220221215739348).jpg'].map((image, index) => (
              <div key={index + 3} className="ranking-listing-box">
                <img src={image} alt={`Most Popular Image ${index + 1}`} className="ranking-listing-image" />
                <span
                  className={`ranking-heart-icon ${liked[index + 3] ? 'liked' : ''}`}
                  onClick={() => handleLike(index + 3)}
                >
                  ♥
                </span>
                <div className="ranking-listing-description">
                  <p>Description of Most Popular Image {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ranking;