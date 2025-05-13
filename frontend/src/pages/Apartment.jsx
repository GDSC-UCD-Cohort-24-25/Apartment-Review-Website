import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Apartment.css';

function Apartment() {
    const { id } = useParams();
    const [apartment, setApartment] = useState(null);
    const [activeTab, setActiveTab] = useState('about');

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/apartments/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setApartment({
                ...data.apartment,
                layouts: data.layouts
            });
        })
    }, [id]);

    if (!apartment) return <div>Loading...</div>;

    return (
        <div>
            <h1>{apartment.name}</h1>

            <div className="tab-bar">
            <button
                className={activeTab === 'about' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('about')}
            >
                About
            </button>
            <button
                className={activeTab === 'review' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('review')}
            >
                Review
            </button>
            </div>
        
            <div className="tab-content">
            {activeTab === 'about' && 
                <div  className='about-tab'>
                    <div>   
                        <h2>About the Property</h2>
                        {apartment.layouts && apartment.layouts.length > 0 ? (
                        apartment.layouts.map((layout, index) => (
                            <div key={index} className="layout-info">
                            <p>💲 {layout.cost ? `$${layout.cost}` : 'Price not listed'}</p>
                            <p>
                                {layout.bedrooms} Bedroom • {layout.bathrooms} Bathroom • {layout.square_feet} sq. ft.
                            </p>
                            </div>
                        ))
                        ) : (
                        <p>No layout information available</p>
                        )}

                        <div className="apartment-address">
                        <p>📍 {apartment.address}</p>
                        </div>

                        <h2>Get in touch</h2>
                        <div className="contact-info">
                        <p>🔗 <a href={apartment.websiteUri} target="_blank" rel="noopener noreferrer">{apartment.websiteUri}</a></p>
                        <p>📞 {apartment.phoneNumber}</p>
                        </div>
                    </div>
                    <div>
                        <img src={apartment.photo}></img>
                    </div>
                </div>
            }
            {activeTab === 'review' && <div>Review section content goes here</div>}
            </div>
        </div>
    );
}

export default Apartment;
