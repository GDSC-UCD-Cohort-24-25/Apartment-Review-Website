import React from 'react';
import { useApartments } from "../ApartmentProvider";
import ListingBox from '../components/ListingBox';
import './home.css';

const Home = ({ filteredResults }) => {
  const { apartments, loading } = useApartments();

  const displayedApartments =
    filteredResults.length > 0 ? filteredResults : apartments;

  const nonNullNeighborhood = (item) => item.apartment.neighborhood !== null;

  const hasSearch = filteredResults.length > 0;

  return (
    <div className="home-container">
      <main className="content">
        {!loading && hasSearch && displayedApartments.length === 0 && (
          <p style={{ padding: '1rem' }}>No apartments matched your search.</p>
        )}

        {!hasSearch && (
          <>
            <div>
              <h2>Featured</h2>
              <div className="listing-container">
                {loading ? (
                  <p>Loading apartments...</p>
                ) : (
                  apartments
                    .filter(nonNullNeighborhood)
                    .map((item) => (
                      <ListingBox key={item.apartment.id} apt={item} />
                    ))
                )}
              </div>
            </div>

            <div>
              <h2>High Rated</h2>
              <div className="listing-container">
                {loading ? (
                  <p>Loading apartments...</p>
                ) : (
                  apartments
                    .filter(nonNullNeighborhood)
                    .map((item) => (
                      <ListingBox key={item.apartment.id} apt={item} />
                    ))
                )}
              </div>
            </div>
          </>
        )}

        {hasSearch && (
          <div>
            <h2>Search Results</h2>
            <div className="listing-container">
              {displayedApartments
                .filter(nonNullNeighborhood)
                .map((item) => (
                  <ListingBox key={item.apartment.id} apt={item} />
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
