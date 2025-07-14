import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import ListingBox from '../components/ListingBox';
import './AllListing.css';
import { useApartments } from "../ApartmentProvider";

function Listing() {
  const { apartments, loading } = useApartments();

  // Filters state
  const [filters, setFilters] = useState({
    price: [],
    housingType: [],
    layout: [],
    bathroom: [],
    occupancy: [],
    features: [],
  });

  // Search results from Navbar search input
  // null = no search yet, [] = search returned no results
  const [searchResults, setSearchResults] = useState(null);

  // Final filtered results after applying filters on top of search results or all apartments
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (!apartments) {
      setFilteredResults([]);
      return;
    }

    // Base list: if searching, start from searchResults, else all apartments
    const baseList = searchResults !== null ? searchResults : apartments;

    let filtered = baseList;

    // Price filter
    if (filters.price.length > 0) {
      filtered = filtered.filter(apt => {
        const price = apt.price?.min_price || 0;
        return filters.price.some(range => {
          switch (range) {
            case 'under500': return price < 500;
            case '500to650': return price >= 500 && price <= 650;
            case '650to800': return price > 650 && price <= 800;
            case '800above': return price > 800;
            default: return true;
          }
        });
      });
    }

    // Housing Type filter
    if (filters.housingType.length > 0) {
      filtered = filtered.filter(apt =>
        filters.housingType.includes(apt.housingType)
      );
    }

    // Layout filter
    if (filters.layout.length > 0) {
      filtered = filtered.filter(apt =>
        filters.layout.includes(apt.layout)
      );
    }

    // Bathroom filter
    if (filters.bathroom.length > 0) {
      filtered = filtered.filter(apt =>
        filters.bathroom.includes(apt.bathroom)
      );
    }

    // Occupancy filter
    if (filters.occupancy.length > 0) {
      filtered = filtered.filter(apt =>
        filters.occupancy.includes(apt.occupancy)
      );
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(apt =>
        filters.features.some(feature => apt.features?.includes(feature))
      );
    }

    setFilteredResults(filtered);
  }, [filters, apartments, searchResults]);

  return (
    <div className="listing-page">
      {/* Pass filters and setFilters to FilterBar */}
      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="listing-body">
        {loading ? (
          <p>Loading apartments...</p>
        ) : filteredResults.length === 0 ? (
          <p>No apartments found.</p>
        ) : (
          <>
            {(filters.price.length +
              filters.housingType.length +
              filters.layout.length +
              filters.bathroom.length +
              filters.occupancy.length +
              filters.features.length > 0 ||
              searchResults !== null) ? (
              <h1>Filtered Listings</h1>
            ) : (
              <h1>All Listings</h1>
            )}

            <div className="listing-container">
              {filteredResults.map(item => (
                <ListingBox key={item.apartment.id} apt={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Listing;
