import React, { useState , useEffect } from 'react';
import { useApartments } from "../ApartmentProvider";

import ListingBox from '../components/ListingBox';
import './Home.css';

const Home = () => {
  const { apartments, loading } = useApartments();

  return (
    <div className="home-container">
      <main className="content">
      <div>
        <h2>Featured</h2>
        <div className="listing-container">
        {loading ?
          <p>Loading apartments...</p>:
          apartments.filter(i=>i.apartment.neighborhood!==null).map((item) => <ListingBox key={item.apartment.id} apt={item}/>)
        }        
        </div>
      </div>
      <div>
        <h2>High Rated</h2>
        <div className="listing-container">
        {loading ?
          <p>Loading apartments...</p>:
          apartments.filter(i=>i.apartment.neighborhood!==null).map((item) => <ListingBox key={item.apartment.id} apt={item}/>)
        }
        </div>
      </div>
      </main>
    </div>
  );
};

export default Home;