import React from 'react';
import './Mapview.css';

const Map = () => {
  return (
    <div className="map-main-content">
      {/* Listings */}
      <div className="map-listings">
        <h2>Map View</h2>
        <div className="map-listing">
          <img src='apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg' alt="Drake and Anderson" />
          <h3>Drake and Anderson</h3>
          <p>West Davis Manor</p>
          <p>650/month</p>
          <div className="map-rating">
            <i className="fas fa-star"></i> 4.5
          </div>
        </div>
        <div className="map-listing">
          <img src="apartments/almondwood/almondwood-apartments-20200519-064.jpg" alt="Almond Apartments" />
          <h3>Almond Apartments</h3>
          <p>West Davis Manor</p>
          <p>650/month</p>
          <div className="map-rating">
            <i className="fas fa-star"></i> 4.5
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="map-map">
        <img src="https://storage.googleapis.com/a1aa/image/i1aPjXTarkfZFtmDfnGl1j4vcBUh7poVXnOSG_nJXcU.jpg" alt="Map" />
        <div className="map-map-prices">
          <div className="map-price">$74</div>
          <div className="map-price">$177</div>
          <div className="map-price">$108</div>
          <div className="map-price">$69</div>
          <div className="map-price">$91</div>
          <div className="map-price">$130</div>
          <div className="map-price">$59</div>
          <div className="map-price">$114</div>
          <div className="map-price">$19</div>
        </div>
      </div>
    </div>
  );
};

export default Map;