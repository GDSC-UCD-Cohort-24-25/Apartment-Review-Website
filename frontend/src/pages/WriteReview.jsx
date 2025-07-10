import React, { useState, useEffect } from "react";
import { FaStar } from 'react-icons/fa'; // Import the star icon from react-icons
import { FiUploadCloud } from 'react-icons/fi'; // Import an upload icon
import { useNavigate, useLocation } from 'react-router-dom';
import { useApartments } from '../ApartmentProvider';
import './WriteReview.css';

function WriteReview() {
  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  // Apartment context
  const { apartments, addReview, loading } = useApartments();

  // State for review content
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [rating, setRating] = useState(0);
  const [author] = useState("Anonymous"); // Set author to Anonymous as per design
  const [uploadedImages, setUploadedImages] = useState([]); // State for uploaded images
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading

  // Find the apartment
  const wrapper = apartments?.find(
    item => String(item.apartment.id) === String(id)
  );
  const apartment = wrapper?.apartment;

  // Redirect if no ID is provided
  useEffect(() => {
    if (!id) {
      navigate('/');
    }
  }, [id, navigate]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    // No auto-resize for now as per Figma design, just fixed height
  };

  const StarRating = ({ rating, onClick }) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`star ${index < rating ? 'active' : ''}`}
            onClick={() => onClick(index + 1)} // Set rating on star click
          />
        ))}
      </div>
    );
  };

  const handleTagClick = (tag) => {
    // Add tag to tagsText if not already present
    const currentTags = tagsText.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      setTagsText((prev) => prev.trim().length ? `${prev}, ${tag}` : tag);
    }
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = reader.result; // Store the base64 string
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Modified handleSubmit function
  const handleSubmit = async () => { // Made the function async
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    // Basic form validation
    if (rating === 0) {
      alert('Please select a rating for your review.');
      return;
    }
    if (description.trim() === "") {
        alert('Please write a description for your review.');
        return;
    }

    setIsSubmitting(true); // Set loading state to true

    try {
      // Create review object
      const review = {
        author, // Will be "Anonymous"
        rating,
        text_review: description,
        tags: tagsText.split(',').map(tag => tag.trim()).filter(tag => tag),
        // In a real application, you'd handle image uploads to a server here
        // and send back URLs, not base64. For now, we'll just omit them from the review object
        // images: uploadedImages,
      };

      // Call addReview function from context
      // Assuming addReview might be an async operation (e.g., API call)
      await addReview(id, review); // Await the addReview call

      // Navigate back to apartment page on success
      navigate(`/apartment/${id}`);

    } catch (error) {
      // Handle any errors during submission (e.g., network error, server error)
      console.error("Failed to post review:", error);
      alert("There was an error posting your review. Please try again later.", error);
    } finally {
      setIsSubmitting(false); // Reset loading state regardless of success or failure
    }
  };

  if (loading) {
    return <p>Loading apartment details...</p>; // More specific loading message
  }

  if (!apartment) {
    return <p>Apartment not found.</p>;
  }

  return (
    <div className="writeReview-page">
      <div className="review-content">
        <div className="review-form">
          <h1>Write a Review</h1> {/* Changed to "Write a Review" as per design */}

          <h2>Rating:</h2>
          <StarRating rating={rating} onClick={setRating} />

          <h2>Description:</h2>
          <textarea
            className="description-box"
            placeholder="Write your review here..."
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>

          <h2 className="add-tags-section">Add tags:</h2>
          <textarea
            className="description-box"
            placeholder="Tag (ex: Modern)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          ></textarea>

          <div className="suggested-tags">
            {["Modern", "Cleanliness", "Management", "Location", "Amenities", "Convenient"].map((tag) => (
              <button
                key={tag}
                className={`tag-suggestion ${tagsText.split(',').map(t => t.trim()).includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            className="post-review-button"
            onClick={handleSubmit}
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Posting...' : 'Post Review'} {/* Change button text during submission */}
          </button>
        </div>

        <div className="upload-section">
          <div className="image-upload-container">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="image-upload-box">
                {uploadedImages[index] ? (
                  <img src={uploadedImages[index]} alt={`Upload ${index + 1}`} />
                ) : (
                  <>
                    {index === 0 && ( // Only show upload icon and text for the first box
                        <>
                            <FiUploadCloud className="upload-icon" />
                            <label htmlFor={`image-upload-${index + 1}`} className="image-upload-label">
                                Upload Media
                            </label>
                        </>
                    )}
                  </>
                )}
                <input
                    type="file"
                    id={`image-upload-${index + 1}`}
                    accept="image/*"
                    className="image-input"
                    onChange={(e) => handleImageUpload(e, index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WriteReview;