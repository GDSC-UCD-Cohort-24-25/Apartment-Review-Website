import React, { useState ,useRef, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Apartment.css';
import { useApartments } from "../ApartmentProvider";

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

export default function Apartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apartments, loading } = useApartments();
  const [activeTab, setActiveTab] = useState('about');

  // 1) pull out the one matching apartment-wrapper object:
  const wrapper = apartments.find(
    item => String(item.apartment.id) === String(id)
  );

  // 2) get your inner data (layouts, reviews, etc.) off of it:
  const apartment = wrapper?.apartment;
  const layouts   = wrapper?.layouts   || [];
  const reviews   = wrapper?.reviews   || [];

  // Handler for navigating to write review page
  const handleWriteReview = () => {
    navigate(`/write-review?id=${id}`);
  };

  // 3) handle loading / not-found early
  if (loading) {
    return <p>Loading apartment…</p>;
  }
  if (!apartment) {
    return <p>Apartment not found.</p>;
  }

  // 4) render normally, using those local variables
  return (
    <div>
      <div className="apartment-header">
        <h1 className='apartment-page-name'>{apartment.name}</h1>
        <button 
          className="write-review-btn"
          onClick={handleWriteReview}
        >
          Write a Review
        </button>
      </div>

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

      {activeTab === 'about' && (
        <div className='about-tab'>
          <div>
            <h2>About the Property</h2>
            <div className='apartment-layouts'>
              {layouts.length > 0
                ? layouts.map((layout, i) => (
                    <div key={i} className="layout-info">
                      <p className='layout-price'>
                        <img src="/dollar-square.svg" alt="price" className="icon" />
                        {layout.cost ? `$${layout.cost}` : 'Price not listed'}
                      </p>
                      <p className='layout-details'>
                        {layout.bedrooms} Bedroom • {layout.bathrooms} Bathroom • {layout.square_feet} sq. ft.
                      </p>
                    </div>
                  ))
                : <p>No layout information available</p>
              }
            </div>

            <div className="apartment-address">
              <p>
                <img src="/location.svg" alt="location" className="icon" />
                <a
                  href={apartment.googleMapsUri}
                  className="url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {apartment.address}
                </a>
              </p>
            </div>

            <h2>Get in touch</h2>
            <div className="contact-info">
              <p>
                <img src="/link.svg" alt="website" className="icon" />
                <a
                  href={apartment.websiteUri}
                  className="url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {apartment.websiteUri}
                </a>
              </p>
              <p>
                <img src="/call.svg" alt="phone" className="icon" />
                {apartment.phoneNumber}
              </p>
            </div>
          </div>

          <div>
            <img className="apartment-image" src={apartment.photo} alt={apartment.name} />
          </div>
        </div>
      )}

      {activeTab === 'review' && (
        <div>
          <h2>What other people say</h2>
          <div className="reviews-grid">
            {reviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}