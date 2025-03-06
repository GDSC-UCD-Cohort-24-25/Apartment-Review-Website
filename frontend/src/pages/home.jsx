import React, { useState , useEffect } from 'react';
import ListingBox from '../components/ListingBox'; // Ensure correct import
import Sidebar from '../components/Sidebar';
import './Home.css';


const Home = () => {
  const [liked, setLiked] = useState([false, false, false]);
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/apartments')
      .then(response => response.json())
      .then(data => {
        setApartments(data.apartments);
        setLiked(new Array(data.apartments.length).fill(false)); // Initialize liked state based on number of apartments
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
        <div className="image-gallery">
        {apartments.map((apartment, index) => (
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
        <div className="image-gallery">
        {['apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg', 'apartments/almondwood/almondwood-apartments-20200519-064.jpg', 'apartments/sycamorelane/RB209244_HDR_Edit(20220221215739348).jpg'].map((image, index) => (
            <ListingBox
              key={index + 3}  // Offset index to avoid duplicate keys
              image={image}
              description={`Description of High Rated Image ${index + 1}`}
              liked={liked[index + 3]}
              onLike={() => handleLike(index + 3)}
            />
          ))}
        </div>
      </div>
      </main>
    </div>
  );
};

export default Home;
