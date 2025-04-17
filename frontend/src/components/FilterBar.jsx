import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = () => {
  const [filters, setFilters] = useState({
    price: [],
    housingType: [],
    layout: [],
    bathroom: [],
    occupancy: [],
    features: [],
    features: [],
  });

  const handleCheckboxChange = (e, category) => {
    const { value } = e.target;
    setFilters(prevState => {
      const newCategory = prevState[category].includes(value)
        ? prevState[category].filter(item => item !== value)
        : [...prevState[category], value];
      return { ...prevState, [category]: newCategory };
    });
  };


  return (
    <div className="filter-bar">
      <h3>Filters</h3>

      {/* Price Filter */}
      <div className="filter-section">
        <h4>Price</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="under500"
              checked={filters.features.includes('under500')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Under $500
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="500to650"
              checked={filters.features.includes('500to650')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            $500 to $650
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="650to800"
              checked={filters.features.includes('650to800')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            $650 to $800
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="800above"
              checked={filters.features.includes('800above')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            $800 and above
          </label>
        </div>
      </div>

      {/* Housing Type Filter */}
      <div className="filter-section">
        <h4>Housing Type</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="apartment"
              checked={filters.features.includes('apartment')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Apartment
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="condo"
              checked={filters.features.includes('condo')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Condo
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="house"
              checked={filters.features.includes('house')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            House
          </label>
        </div><div>
          <label>
            <input
              type="checkbox"
              value="townhouse"
              checked={filters.features.includes('townhouse')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Townhouse
          </label>
        </div>
      </div>

      {/* Layout Filter */}
      <div className="filter-section">
        <h4>Layout</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="studio"
              checked={filters.features.includes('studio')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Studio 
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="loft"
              checked={filters.features.includes('loft')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Loft 
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="oneBedroom"
              checked={filters.features.includes('oneBedroom')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            One Bedroom
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="twoBedroom"
              checked={filters.features.includes('twoBedroom')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Two Bedroom 
          </label>
        </div>
        {/* Add more layout types here */}
      </div>

      {/* Bathroom Filter */}
      <div className="filter-section">
        <h4>Bathroom</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="full"
              checked={filters.features.includes('full')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Full
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="half"
              checked={filters.features.includes('half')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Half
          </label>
        </div>
      </div>

      {/* Occupancy Filter */}
      <div className="filter-section">
        <h4>Occupancy</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="single"
              checked={filters.features.includes('single')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Single
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="double"
              checked={filters.features.includes('double')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Double
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="triple"
              checked={filters.features.includes('triple')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Triple
          </label>
        </div>
      </div>

      {/* features Filter */}
      <div className="filter-section">
        <h4>Amenities</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="dryer-communal"
              checked={filters.features.includes('dryer-communal')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Dryer (communal)
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="dryer-inunit"
              checked={filters.features.includes('dryer-inunit')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Dryer (in unit)
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="washer-communal"
              checked={filters.features.includes('washer-communal')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Washer (communal)
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="washer-inunit"
              checked={filters.features.includes('washer-inunit')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Washer (in unit)
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="wifi"
              checked={filters.features.includes('wifi')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Wifi
          </label>
        </div>
      </div>

      {/* Features Filter */}
      <div className="filter-section">
        <h4>Features</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="balcony"
              checked={filters.features.includes('balcony')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Balcony
          </label>
        </div>
  
        <div>
          <label>
            <input
              type="checkbox"
              value="coEd"
              checked={filters.features.includes('coEd')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Co-ed
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              value="furnished"
              checked={filters.features.includes('furnished')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Furnished
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="gym"
              checked={filters.features.includes('gym')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Gym
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="patio"
              checked={filters.features.includes('patio')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Patio
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="pet"
              checked={filters.features.includes('pet')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Pets Friendly
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              value="smoking"
              checked={filters.features.includes('smoking')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Smoking Allowed
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              value="storage"
              checked={filters.features.includes('storage')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Storage
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="unfurnished"
              checked={filters.features.includes('unfurnished')}
              onChange={e => handleCheckboxChange(e, 'features')}
            />
            Unfurnished
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
