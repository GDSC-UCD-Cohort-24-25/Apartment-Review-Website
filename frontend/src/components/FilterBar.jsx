import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = () => {
  const [filters, setFilters] = useState({
    price: '',
    housingType: '',
    layout: '',
    bathroom: '',
    occupancy: '',
    amenities: [],
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

  const handleRadioChange = (e, category) => {
    const { value } = e.target;
    setFilters(prevState => ({ ...prevState, [category]: value }));
  };

  const handlePriceChange = (e) => {
    setFilters(prevState => ({ ...prevState, price: e.target.value }));
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
              type="radio"
              name="price"
              value="under500"
              checked={filters.price === 'under500'}
              onChange={e => handlePriceChange(e)}
            />
            Under $500
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="price"
              value="500to650"
              checked={filters.price === '500to650'}
              onChange={e => handlePriceChange(e)}
            />
            $500 to $650
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="price"
              value="650to800"
              checked={filters.price === '650to800'}
              onChange={e => handlePriceChange(e)}
            />
            $650 to $800
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="price"
              value="800above"
              checked={filters.price === '800above'}
              onChange={e => handlePriceChange(e)}
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
              type="radio"
              name="housingType"
              value="apartment"
              checked={filters.housingType === 'apartment'}
              onChange={e => handleRadioChange(e, 'housingType')}
            />
            Apartment
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="housingType"
              value="condo"
              checked={filters.housingType === 'condo'}
              onChange={e => handleRadioChange(e, 'housingType')}
            />
            Condo
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="housingType"
              value="house"
              checked={filters.housingType === 'house'}
              onChange={e => handleRadioChange(e, 'housingType')}
            />
            House
          </label>
        </div><div>
          <label>
            <input
              type="radio"
              name="housingType"
              value="townhouse"
              checked={filters.housingType === 'townhouse'}
              onChange={e => handleRadioChange(e, 'housingType')}
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
              type="radio"
              name="layout"
              value="studio"
              checked={filters.layout === 'studio'}
              onChange={e => handleRadioChange(e, 'layout')}
            />
            Studio 
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="layout"
              value="loft"
              checked={filters.layout === 'loft'}
              onChange={e => handleRadioChange(e, 'layout')}
            />
            Loft 
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="layout"
              value="oneBedroom"
              checked={filters.layout === 'oneBedroom'}
              onChange={e => handleRadioChange(e, 'layout')}
            />
            One Bedroom
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="layout"
              value="twoBedroom"
              checked={filters.layout === 'twoBedroom'}
              onChange={e => handleRadioChange(e, 'layout')}
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
              type="radio"
              name="bathroom"
              value="full"
              checked={filters.bathroom === 'full'}
              onChange={e => handleRadioChange(e, 'bathroom')}
            />
            Full
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="bathroom"
              value="half"
              checked={filters.bathroom === 'half'}
              onChange={e => handleRadioChange(e, 'bathroom')}
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
              type="radio"
              name="occupancy"
              value="single"
              checked={filters.occupancy === 'single'}
              onChange={e => handleRadioChange(e, 'occupancy')}
            />
            Single
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="occupancy"
              value="double"
              checked={filters.occupancy === 'double'}
              onChange={e => handleRadioChange(e, 'occupancy')}
            />
            Double
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="occupancy"
              value="triple"
              checked={filters.occupancy === 'triple'}
              onChange={e => handleRadioChange(e, 'occupancy')}
            />
            Triple
          </label>
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="filter-section">
        <h4>Amenities</h4>
        <div>
          <label>
            <input
              type="checkbox"
              value="dryer"
              checked={filters.amenities.includes('dryer')}
              onChange={e => handleCheckboxChange(e, 'amenities')}
            />
            Dryer
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="washer"
              checked={filters.amenities.includes('washer')}
              onChange={e => handleCheckboxChange(e, 'amenities')}
            />
            Washer
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
      </div>
    </div>
  );
};

export default FilterBar;
