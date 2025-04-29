import React, { useState , useEffect } from 'react';
import ListingBox from '../components/ListingBox';
import './Home.css';

const Home = () => {
  const [liked, setLiked] = useState([false, false, false]);
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/apartments')
      .then(response => response.json())
      .then(data => {
        setApartments(data.apartments);
        setLiked(new Array(data.apartments.length).fill(false));
      })
      .catch(error => console.error('Error fetching apartments:', error));
  }, []);

  const handleLike = (index) => {
    setLiked((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="home-container">
      <main className="content">
      <div>
        <h2>Featured</h2>  {/* Add "Featured" text */}
        <div className="listing-container">
        {apartments.slice(0,15).map((apartment, index) => (
          <ListingBox
            key={apartment.id}
            image={apartment.photo}
            description={apartment.name}
            phone = {apartment.phoneNumber}
            address = {apartment.shortAddress}
            liked={liked[index]}
            onLike={() => handleLike(index)}
          />
        ))}
        </div>
      </div>
      <div>
        {/* High Rated Section */}
        <h2>High Rated</h2>
        <div className="listing-container">
        {apartments.slice(0,15).map((apartment, index) => (
          <ListingBox
            key={apartment.id}
            image={apartment.photo}
            description={apartment.name}
            phone = {apartment.phoneNumber}
            address = {apartment.shortAddress}
            liked={liked[index]}
            onLike={() => handleLike(index)}
          />
        ))}
        </div>
      </div>
      </main>
    </div>
  );
};

export default Home;
