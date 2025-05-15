import React, { useEffect, useState , useRef} from 'react';
import { useParams } from 'react-router-dom';
import './Apartment.css';



function ReviewCard({ review }) {
  const { author, rating, text_review, avatarUrl } = review;
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const textRef = useRef(null);
  const charLimit = 300; // Character threshold for truncation

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setNeedsToggle(el.scrollHeight > el.clientHeight);
    }
  }, []);

  return (
    <div className="review-card">
      <div className="review-header">
        <img
          src={"https://ui-avatars.com/api/?background=random&name=" + author}
          alt={author}
          className="review-avatar"
        />
        <h4 className='author'>{author}</h4>
      </div>

      <div className="review-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <img
            key={i}
            src={i < rating ? "/star-filled.svg" : "/star-blank.svg"}
            alt={i < rating ? "filled star" : "blank star"}
            className="star-icon"
          />
        ))}
      </div>

      <p
        ref={textRef}
        className={`review-text ${expanded ? 'expanded' : ''}`}
      >
        {text_review || "No Text"}
      </p>

      {needsToggle && (
        <button
          className="read-more"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}

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
                    layouts: data.layouts,
                    reviews: data.reviews
                });
            });
    }, [id]);

    if (!apartment) return <div>Loading...</div>;

    return (
        <div>
            <h1 className='apartment-name'>{apartment.name}</h1>

            <div className="tab-bar">
            <button
                className={activeTab === 'about' ? 'active' : 'nonactive'}
                onClick={() => setActiveTab('about')}
            >
                About
            </button>
            <button
                className={activeTab === 'review' ? 'active' : 'nonactive'}
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
                        <div className='apartment-layouts'>
                        {apartment.layouts && apartment.layouts.length > 0 ? (
                        apartment.layouts.map((layout, index) => (
                            <div key={index} className="layout-info">
                            <p className='layout-price'>
                                <img src="/dollar-square.svg" alt="price" className="icon" />
                                {layout.cost ? `$${layout.cost}` : 'Price not listed'}</p>
                            <p className='layout-details'>
                                {layout.bedrooms} Bedroom • {layout.bathrooms} Bathroom • {layout.square_feet} sq. ft.
                            </p>
                            </div>
                        
                        ))
                        ) : (
                        <p>No layout information available</p>
                        )}
                        </div>

                        <div className="apartment-address">
                        <p>
                           <img src="/location.svg" alt="price" className="icon" />
                           <a href={apartment.googleMapsUri} class="url" target="_blank" rel="noopener noreferrer">{apartment.address}</a>
                            
                        </p>
                        </div>

                        <h2>Get in touch</h2>
                        <div className="contact-info">
                        <p>
                            <img src="/link.svg" alt="price" className="icon" />
                            <a href={apartment.websiteUri} class="url" target="_blank" rel="noopener noreferrer">{apartment.websiteUri}</a></p>
                        <p>
                            <img src="/call.svg" alt="price" className="icon" />
                            {apartment.phoneNumber}</p>
                        </div>
                    </div>
                    <div>
                        <img className="apartment-image" src={apartment.photo}></img>
                    </div>
                </div>
            }
            {activeTab === 'review' && 
                <div>
                    <h2>What other people say</h2>
                <div className="reviews-grid">
                {apartment?.reviews?.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                ))}
                </div>
                </div>
            }
            </div>
        </div>
    );
}






export default Apartment;
