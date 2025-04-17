import React, { useState, useEffect } from 'react';
import ListingBox from '../components/ListingBox'; // Ensure correct import
import Sidebar from '../components/Sidebar'; // Optional: include if needed
import './Ranking.css';

// Mapping of apartment IDs to image paths and descriptions.
// Update these values to match the actual apartments and media in your project.
const apartmentData = {
  apt1: {
    image: "apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg",
    description: "The Drake & Anderson"
  },
  apt2: {
    image: "apartments/almondwood/almondwood-apartments-20200519-064.jpg",
    description: "Almondwood"
  },
  apt3: {
    image: "apartments/sycamorelane/RB209244_HDR_Edit(20220221215739348).jpg",
    description: "Sycamore Lane"
  },
};

const Ranking = () => {
  const [rankings, setRankings] = useState([]);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the ranking data from the Python backend (/rankings endpoint)
  useEffect(() => {
    // Note the updated URL endpoint:
    fetch('http://127.0.0.1:5000/rankings')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Rankings Data:", data);  // Debug: check fetched data in console
        if (!Array.isArray(data) || data.length === 0) {
          data = ['apt1', 'apt2', 'apt3'];
        }
        setRankings(data);
        setLiked(new Array(data.length).fill(false));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rankings:', error);
        const fallback = ['apt1', 'apt2', 'apt3'];
        setRankings(fallback);
        setLiked(new Array(fallback.length).fill(false));
        setLoading(false);
      });
  }, []);
  

  // Toggle "like" status for a given index.
  const handleLike = (index) => {
    setLiked(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // Split the fetched rankings into two sections:
  // "Featured" contains the first three items, and "High Rated" the next three items.
  const featured = rankings.slice(0, 3);
  const highRated = rankings.slice(0, 3);

  return (
    <div className="ranking-container">
      <main className="content">
        {loading ? (
          <p>Loading rankings...</p>
        ) : (
          <>
            {/* Featured Section */}
            <div>
              <h2>Featured</h2>
              <div className="image-gallery">
                {featured.map((aptId, index) => {
                  const aptInfo = apartmentData[aptId] || {
                    image: "apartments/default.jpg",
                    description: `Description of ${aptId}`
                  };
                  return (
                    <ListingBox
                      key={aptId}
                      image={aptInfo.image}
                      description={aptInfo.description}
                      liked={liked[index]}
                      onLike={() => handleLike(index)}
                    />
                  );
                })}
              </div>
            </div>
            {/* High Rated Section */}
            <div>
              <h2>High Rated</h2>
              <div className="image-gallery">
                {highRated.map((aptId, index) => {
                  const overallIndex = index + featured.length; // offset index for liked state
                  const aptInfo = apartmentData[aptId] || {
                    image: "apartments/default.jpg",
                    description: `Description of ${aptId}`
                  };
                  return (
                    <ListingBox
                      key={aptId}
                      image={aptInfo.image}
                      description={aptInfo.description}
                      liked={liked[overallIndex]}
                      onLike={() => handleLike(overallIndex)}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Ranking;
