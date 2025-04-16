import React, { useState, useEffect } from 'react';
import './Mapview.css';
import ListingBox from '../components/ListingBox';


const propertyData = [
  {
    "name": "Academy Lane Apartment Homes",
    "location": {
      "latitude": 38.5551655,
      "longitude": -121.74247690000001
    }
  },
  {
    "name": "Orchard Park Apartments",
    "location": {
      "latitude": 38.5448052,
      "longitude": -121.765171
    }
  },
  {
    "name": "Lakeshore",
    "location": {
      "latitude": 38.553548000000006,
      "longitude": -121.78843350000001
    }
  },
  {
    "name": "Avalon Apartments",
    "location":{
      "latitude": 38.538311,
      "longitude": -121.72467800000001
    }
  },
  {
    "name": "Sherwood & Forest Arms Apartments",
    "location": {
      "latitude": 38.5485591,
      "longitude": -121.7653588
    }
  },
  {
    "name": "J Street Apartments",
    "location": {
      "latitude": 38.5568567,
      "longitude": -121.74148710000001
    }
  },
  {
    "name": "The U Apartments",
    "location": {
      "latitude": 38.5496102,
      "longitude": -121.7208849
    }
  },
  {
    "name": "Davisville Management Company",
    "location": {
      "latitude": 38.548474999999996,
      "longitude": -121.72145750000001
    }
  },
  {
    "name": "Alvarado Parkside Apartments",
    "location": {
      "latitude": 38.5613515,
      "longitude": -121.75182029999999
    }
  },
  {
    "name": "Greystone",
    "location": {
      "latitude": 38.5530083,
      "longitude": -121.7205796
    }
  },
  {
    "name": "University House",
    "location": {
      "latitude": 38.546600999999995,
      "longitude": -121.73460589999998
    }
  },
  {
    "name": "MarCo at the Cannery Apartments",
    "location": {
      "latitude": 38.5616422,
      "longitude": -121.74235929999999
    }
  },
  {
    "name": "Cottages on 5th",
    "location": {
      "latitude": 38.549568099999995,
      "longitude": -121.72605129999998
    }
  },
  {
    "name": "Sorrento Apartments",
    "location": {
      "latitude": 38.5395013,
      "longitude": -121.7230862
    }
  },
  {
    "name": "Identity Davis",
    "location": {
      "latitude": 38.5469483,
      "longitude": -121.76469110000001
    }
  },
  {
    "name": "College Street Apartments",
    "location": {
      "latitude": 38.5536962,
      "longitude": -121.72994340000001
    }
  },
  {
    "name": "Seville at Mace Ranch",
    "location": {
      "latitude": 38.5596885,
      "longitude": -121.69675439999999
    }
  },
  {
    "name": "DaVinci",
    "location": {
      "latitude": 38.5366114,
      "longitude": -121.73174669999997
    }
  },
  {
    "name": "Westwood",
    "location": {
      "latitude": 38.5511641,
      "longitude": -121.7686749
    }
  },
  {
    "name": "La Casa de Flores Apartments",
    "location": {
      "latitude": 38.5469627,
      "longitude": -121.7651901
    }
  },
  {
    "name": "University Court",
    "location": {
      "latitude": 38.5469777,
      "longitude": -121.76250990000001
    }
  },
  {
    "name": "Chaparral Apartments",
    "location": {
      "latitude": 38.566287,
      "longitude": -121.76664000000001
    }
  },
  {
    "name": "B St Apartments by Brittain Commercial",
    "location": {
      "latitude": 38.5431452,
      "longitude": -121.74491799999998
    }
  },
  {
    "name": "298 Celadon",
    "location": {
      "latitude": 38.5425344,
      "longitude": -121.77310100000001
    }
  },
  {
    "name": "Almondwood Apartments",
    "location": {
      "latitude": 38.561346,
      "longitude": -121.76352299999999
    }
  },
  {
    "name": "The Celeste",
    "location": {
      "latitude": 38.55001610000001,
      "longitude": -121.70357240000001
    }
  },
  {
    "name": "The Green at West Village",
    "location": {
      "latitude": 38.541814699999996,
      "longitude": -121.77679789999999
    }
  },
  {
    "name": "Casitas",
    "location": {
      "latitude": 38.5623164,
      "longitude": -121.75822850000002
    }
  },
  {
    "name": "The Spoke",
    "location": {
      "latitude": 38.5536155,
      "longitude": -121.7400588
    }
  },
  {
    "name": "Temescal",
    "location": {
      "latitude": 38.5646434,
      "longitude": -121.76602739999998
    }
  },
  {
    "name": "Sycamore Lane Apartments",
    "location": {
      "latitude": 38.5481719,
      "longitude": -121.76038360000001
    }
  },
  {
    "name": "Eleanor Roosevelt Circle",
    "location": {
      "latitude": 38.5509351,
      "longitude": -121.72055060000001
    }
  },
  {
    "name": "Cascade Apartments",
    "location": {
      "latitude": 38.552854499999995,
      "longitude": -121.72751740000001
    }
  },
  {
    "name": "Pinecrest Apartments",
    "location": {
      "latitude": 38.5591405,
      "longitude": -121.7407546
    }
  },
  {
    "name": "Russell Park Apartments",
    "location": {
      "latitude": 38.543923,
      "longitude": -121.763966
    }
  },
  {
    "name": "Gate Way Properties",
    "location": {
      "latitude": 38.548491899999995,
      "longitude": -121.7214735
    }
  },
  {
    "name": "Cannery Village",
    "location": {
      "latitude": 38.5622477,
      "longitude": -121.74289739999998
    }
  },
  {
    "name": "Axis at Davis",
    "location": {
      "latitude": 38.545555900000004,
      "longitude": -121.72338970000001
    }
  },
  {
    "name": "Suntree Apartments",
    "location": {
      "latitude": 38.561521,
      "longitude": -121.74621799999998
    }
  },
  {
    "name": "Tandem Properties",
    "location": {
      "latitude": 38.572792299999996,
      "longitude": -121.7495613
    }
  },
  {
    "name": "La Salle Apartments",
    "location": {
      "latitude": 38.5614457,
      "longitude": -121.760459
    }
  },
  {
    "name": "Portage Bay",
    "location": {
      "latitude": 38.5494164,
      "longitude": -121.78774849999999
    }
  },
  {
    "name": "Greenbriar",
    "location": {
      "latitude": 38.552799199999995,
      "longitude": -121.74320979999999
    }
  },
  {
    "name": "慕爱堂",
    "location": {
      "latitude": 38.537448999999995,
      "longitude": -121.77113499999999
    }
  },
  {
    "name": "Ryder on Olive",
    "location": {
      "latitude": 38.54303850000001,
      "longitude": -121.7357688
    }
  },
  {
    "name": "Lexington Apartments",
    "location": {
      "latitude": 38.542049399999996,
      "longitude": -121.73550409999999
    }
  },
  {
    "name": "Eastlake",
    "location": {
      "latitude": 38.5558814,
      "longitude": -121.78692489999999
    }
  },
  {
    "name": "The Colleges at La Rue Apartments",
    "location": {
      "latitude": 38.5411742,
      "longitude": -121.76214509999998
    }
  },
  {
    "name": "Cesar Chavez Plaza",
    "location": {
      "latitude": 38.5424437,
      "longitude": -121.73476069999998
    }
  },
  {
    "name": "Terracina at Wildhorse | Affordable Apartments",
    "location": {
      "latitude": 38.5709369,
      "longitude": -121.7300407
    }
  },
  {
    "name": "Greenhaus Apartments",
    "location": {
      "latitude": 38.5416496,
      "longitude": -121.73101360000001
    }
  },
  {
    "name": "Alvarado Sunset",
    "location": {
      "latitude": 38.5611648,
      "longitude": -121.7530136
    }
  },
  {
    "name": "Stonegate Village Apartments",
    "location": {
      "latitude": 38.5474229,
      "longitude": -121.78719009999999
    }
  },
  {
    "name": "Clubside Apartments",
    "location": {
      "latitude": 38.552646599999996,
      "longitude": -121.7870178
    }
  },
  {
    "name": "Renaissance Park Apartments",
    "location": {
      "latitude": 38.5425458,
      "longitude": -121.7147354
    }
  },
  {
    "name": "Adobe At Evergreen Apartments",
    "location": {
      "latitude": 38.560068,
      "longitude": -121.771035
    }
  },
  {
    "name": "Heather Glen Apartments",
    "location": {
      "latitude": 38.5545683,
      "longitude": -121.78044860000001
    }
  },
  {
    "name": "Meadow Ridge",
    "location": {
      "latitude": 38.5489369,
      "longitude": -121.69709350000001
    }
  },
  {
    "name": "Pepperwood",
    "location": {
      "latitude": 38.5627999,
      "longitude": -121.7645154
    }
  },
  {
    "name": "Homestead",
    "location": {
      "latitude": 38.5530329,
      "longitude": -121.71916920000001
    }
  },
  {
    "name": "187 Mint Street",
    "location": {
      "latitude": 38.540599199999996,
      "longitude": -121.7767849
    }
  },
  {
    "name": "Atriums at La Rue Park",
    "location": {
      "latitude": 38.5450185,
      "longitude": -121.76387129999999
    }
  },
  {
    "name": "Sterling 5th Street",
    "location": {
      "latitude": 38.5488044,
      "longitude": -121.7240223
    }
  },
  {
    "name": "Aggie Square Apartments",
    "location": {
      "latitude": 38.5614166,
      "longitude": -121.75657960000001
    }
  },
  {
    "name": "Octave",
    "location": {
      "latitude": 38.5376185,
      "longitude": -121.72771009999998
    }
  },
  {
    "name": "Arlington Farm",
    "location": {
      "latitude": 38.548782599999996,
      "longitude": -121.78596619999998
    }
  },
  {
    "name": "Creekside",
    "location": {
      "latitude": 38.5533748,
      "longitude": -121.71186589999999
    }
  },
  {
    "name": "Twin Pines Apartments",
    "location": {
      "latitude": 38.574205,
      "longitude": -121.7480101
    }
  },
  {
    "name": "Brisa Villas",
    "location": {
      "latitude": 38.5385829,
      "longitude": -121.72394029999998
    }
  },
  {
    "name": "The Trees",
    "location": {
      "latitude": 38.5476129,
      "longitude": -121.78861789999999
    }
  },
  {
    "name": "The Edge Apartments",
    "location": {
      "latitude": 38.548624,
      "longitude": -121.70258369999998
    }
  },
  {
    "name": "Third & C",
    "location": {
      "latitude": 38.5439497,
      "longitude": -121.74388549999999
    }
  },
  {
    "name": "Muir Commons",
    "location": {
      "latitude": 38.555968,
      "longitude": -121.77940799999998
    }
  },
  {
    "name": "3rd & U Apartments",
    "location": {
      "latitude": 38.543864299999996,
      "longitude": -121.74628349999999
    }
  },
  {
    "name": "Walnut Terrace Apartments",
    "location": {
      "latitude": 38.5549581,
      "longitude": -121.71008270000002
    }
  },
  {
    "name": "Campus Manor",
    "location": {
      "latitude": 38.543292699999995,
      "longitude": -121.7466654
    }
  },
  {
    "name": "301 Citron",
    "location": {
      "latitude": 38.5426543,
      "longitude": -121.7764783
    }
  },
  {
    "name": "Chestnut Place Apartments",
    "location": {
      "latitude": 38.5536817,
      "longitude": -121.73145249999999
    }
  },
  {
    "name": "Saratoga West",
    "location": {
      "latitude": 38.560055899999995,
      "longitude": -121.77688699999999
    }
  },
  {
    "name": "Silverstone Apartments",
    "location": {
      "latitude": 38.564516399999995,
      "longitude": -121.72959870000001
    }
  },
  {
    "name": "University Square",
    "location": {
      "latitude": 38.5457393,
      "longitude": -121.73566539999999
    }
  },
  {
    "name": "Villa Verde Apartments",
    "location": {
      "latitude": 38.542944299999995,
      "longitude": -121.7455806
    }
  },
  {
    "name": "Tremont Green",
    "location": {
      "latitude": 38.552204200000006,
      "longitude": -121.6764712
    }
  },
  {
    "name": "Pi\u00f1on",
    "location": {
      "latitude": 38.5471408,
      "longitude": -121.76661089999999
    }
  },
  {
    "name": "\u201cThe Lofts\u201d",
    "location": {
      "latitude": 38.5423427,
      "longitude": -121.74097440000001
    }
  },
  {
    "name": "Wake Forest",
    "location": {
      "latitude": 38.548201399999996,
      "longitude": -121.7634292
    }
  },
  {
    "name": "UC Davis Apartments",
    "location": {
      "latitude": 38.540570699999996,
      "longitude": -121.7768311
    }
  },
  {
    "name": "Parkside Apartments",
    "location": {
      "latitude": 38.5580366,
      "longitude": -121.7434179
    }
  },
  {
    "name": "Becerra Plaza",
    "location": {
      "latitude": 38.5479512,
      "longitude": -121.705486
    }
  },
  {
    "name": "Aero Apartments",
    "location": {
      "latitude": 38.5594813,
      "longitude": -121.7594912
    }
  },
  {
    "name": "Sequoia",
    "location": {
      "latitude": 38.5627462,
      "longitude": -121.76589290000001
    }
  },
  {
    "name": "Mission Villas Community",
    "location": {
      "latitude": 38.5433331,
      "longitude": -121.74484170000001
    }
  },
  {
    "name": "Owendale Community",
    "location": {
      "latitude": 38.5465051,
      "longitude": -121.7143802
    }
  },
  {
    "name": "Hanover Place Apartments",
    "location": {
      "latitude": 38.5586421,
      "longitude": -121.75724089999999
    }
  },
  {
    "name": "Kings & Queens Apartments",
    "location": {
      "latitude": 38.5518175,
      "longitude": -121.74125259999998
    }
  },
  {
    "name": "Windmere Apartments",
    "location": {
      "latitude": 38.553505,
      "longitude": -121.7100136
    }
  },
  {
    "name": "Woodside Apartments",
    "location": {
      "latitude": 38.552068399999996,
      "longitude": -121.7419302
    }
  },
  {
    "name": "\u7eaf\u7231\u7518\u9732\u5bfa",
    "location": {
      "latitude": 38.5386734,
      "longitude": -121.77136859999999
    }
  },
  {
    "name": "Glide Terrace Apartments",
    "location": {
      "latitude": 38.5526029,
      "longitude": -121.68834799999999
    }
  },
  {
    "name": "184 Horizon",
    "location": {
      "latitude": 38.5405844,
      "longitude": -121.7786625
    }
  },
  {
    "name": "Parque Plaza",
    "location": {
      "latitude": 38.5614876,
      "longitude": -121.7578088
    }
  },
  {
    "name": "Drake Apartments",
    "location": {
      "latitude": 38.5603955,
      "longitude": -121.76097340000001
    }
  },
  {
    "name": "Tuscany Villas Apartments",
    "location": {
      "latitude": 38.554021,
      "longitude": -121.72053299999997
    }
  },
  {
    "name": "Arrowhead",
    "location": {
      "latitude": 38.5623846,
      "longitude": -121.74472050000001
    }
  },
  {
    "name": "Dowling Properties",
    "location": {
      "latitude": 38.544578099999995,
      "longitude": -121.7423211
    }
  }
];

const Map = () => {
  const [liked, setLiked] = useState([]);
  
  useEffect(() => {
    const initMap = () => {
      // Create the map instance
      const mapInstance = new window.google.maps.Map(
        document.getElementById('map'),
        {
          center: { lat: 38.5449, lng: -121.7405 },
          zoom: 14,
          disableDefaultUI: true,
          styles: [] // Optional: Add custom map styles
        }
      );

      // Loop through each property in the data array and add a marker
      propertyData.forEach((property) => {
        new window.google.maps.Marker({
          position: {
            lat: property.location.latitude,
            lng: property.location.longitude
          },
          map: mapInstance,
          title: property.name
        });
      });
    };

    // Check if Google Maps API is already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error('Error loading Google Maps script');
      };
      document.head.appendChild(script);
      // Attach the callback to window
      window.initMap = initMap;
    } else {
      initMap();
    }
  }, []);

  return (
    <div className="map-main-content">
      {/* Listings */}
      <div className="map-listings">
        <h2>Map View</h2>
        <div className="listing-container">
          {['apartments/thedrakeandanderson/the-drake-and-anderson-court-davis-ca-primary-photo.jpg',
            'apartments/almondwood/almondwood-apartments-20200519-064.jpg',
            'apartments/sycamorelane/RB209244_HDR_Edit(20220221215739348).jpg'
          ].map((image, index) => (
            <ListingBox
              key={index + 3}  // Offset index to avoid duplicate keys
              image={image}
              description={`Description of High Rated Image ${index + 1}`}
              liked={liked[index + 3]}
              onLike={() => {
                // TODO: Implement your handleLike logic here.
              }}
            />
          ))}
        </div>
      </div>

      {/* Google Map */}
      <div id="map" className="map-map"></div>
    </div>
  );
};

export default Map;
