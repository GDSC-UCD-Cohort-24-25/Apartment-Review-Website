import React, {useState} from "react";
import { FaStar } from 'react-icons/fa'; // Import the star icon from react-icons
import './writeReview.css';


function WriteReview() {
    const [description, setDescription] = useState("");
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        e.target.style.height = "auto"; // Reset height
        e.target.style.height = `${e.target.scrollHeight}px`; // Auto expand vertically
      };

    const [tagsText, setTagsText] = useState("");
  
    // State for rating
    const [rating, setRating] = useState(0);
    const StarRating = ({ rating, onClick }) => {
        return (
            <div className="star-rating">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className="star"
                  style={{ color: index < rating ? '#78b2a3' : '#D2D2D9' }}
                  onClick={() => onClick(index + 1)} // Set rating on star click
                />
              ))}
            </div>
          );
    };
 

    return (
    <div className="writeReview-page">
    <div className="review-form">

      <h1>Write a Review</h1>
      <h2>Rating:</h2>

      <StarRating rating={rating} onClick={setRating} />


      <h2>Description:</h2>
      {/* Textbox for description */}
      <textarea className="description-box" placeholder="Write your review here..."value={description} onChange={handleDescriptionChange}></textarea>

      <h2>Add tags:</h2>
      <textarea className="description-box" placeholder="Tag (ex: Modern)" value={tagsText} onChange={(e) => setTagsText(e.target.value)}></textarea>
      
    <div className="suggested-tags">
        {["lorem", "ipsum", "apple", "hello"].map((tag) => (
        <button key={tag} className="tag-suggestion" onClick={() => setTagsText((prev) => prev.trim().length ? `${prev}, ${tag}` : tag)}>
      {tag}
    </button>
    ))}
    </div>

    <button className="post-review">Post Review</button>
    </div>

    <div class="upload-section">
        <div class="image-upload-container">
        <div class="image-upload-box">
        <label htmlFor="image-upload-1" className="image-upload-label">
            Upload Media
        </label>
        <input type="file" id="image-upload-1" accept="image/*" class="image-input" />
         </div>
        <div class="image-upload-box">
      <input type="file" id="image-upload-2" accept="image/*" class="image-input" />
        </div>
        <div class="image-upload-box">
        <input type="file" id="image-upload-3" accept="image/*" class="image-input" />
        </div>
        <div class="image-upload-box">
        <input type="file" id="image-upload-4" accept="image/*" class="image-input" />
        </div>
        </div>
        </div>

    </div>
  );
}

export default WriteReview;
