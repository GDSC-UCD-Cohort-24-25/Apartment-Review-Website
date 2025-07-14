import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, setFilters }) => {
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
              checked={filters.price.includes('under500')}
              onChange={e => handleCheckboxChange(e, 'price')}
            />
            Under $500
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="500to650"
              checked={filters.price.includes('500to650')}
              onChange={e => handleCheckboxChange(e, 'price')}
            />
            $500 to $650
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="650to800"
              checked={filters.price.includes('650to800')}
              onChange={e => handleCheckboxChange(e, 'price')}
            />
            $650 to $800
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="800above"
              checked={filters.price.includes('800above')}
              onChange={e => handleCheckboxChange(e, 'price')}
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
              checked={filters.housingType.includes('apartment')}
              onChange={e => handleCheckboxChange(e, 'housingType')}
            />
            Apartment
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="condo"
              checked={filters.housingType.includes('condo')}
              onChange={e => handleCheckboxChange(e, 'housingType')}
            />
            Condo
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="house"
              checked={filters.housingType.includes('house')}
              onChange={e => handleCheckboxChange(e, 'housingType')}
            />
            House
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="townhouse"
              checked={filters.housingType.includes('townhouse')}
              onChange={e => handleCheckboxChange(e, 'housingType')}
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
              checked={filters.layout.includes('studio')}
              onChange={e => handleCheckboxChange(e, 'layout')}
            />
            Studio
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="loft"
              checked={filters.layout.includes('loft')}
              onChange={e => handleCheckboxChange(e, 'layout')}
            />
            Loft
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="oneBedroom"
              checked={filters.layout.includes('oneBedroom')}
              onChange={e => handleCheckboxChange(e, 'layout')}
            />
            One Bedroom
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="twoBedroom"
              checked={filters.layout.includes('twoBedroom')}
              onChange={e => handleCheckboxChange(e, 'layout')}
            />
            Two Bedroom
          </label>
        </div>
      </div>

      {/* Bathroom Filter */}
      <div className="filter-section">
        <h4>Bathroom</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="full"
              checked={filters.bathroom.includes('full')}
              onChange={e => handleCheckboxChange(e, 'bathroom')}
            />
            Full
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="half"
              checked={filters.bathroom.includes('half')}
              onChange={e => handleCheckboxChange(e, 'bathroom')}
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
              checked={filters.occupancy.includes('single')}
              onChange={e => handleCheckboxChange(e, 'occupancy')}
            />
            Single
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="double"
              checked={filters.occupancy.includes('double')}
              onChange={e => handleCheckboxChange(e, 'occupancy')}
            />
            Double
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="triple"
              checked={filters.occupancy.includes('triple')}
              onChange={e => handleCheckboxChange(e, 'occupancy')}
            />
            Triple
          </label>
        </div>
      </div>

      {/* Features (Amenities) Filter */}
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

      {/* Additional Features Filter */}
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
