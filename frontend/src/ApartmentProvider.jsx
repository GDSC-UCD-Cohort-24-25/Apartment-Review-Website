// context/ApartmentContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import supabase from './supabase-client';
const ApartmentContext = createContext();
const route = "http://127.0.0.1:5000/apartments"
export const ApartmentProvider = ({ children }) => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(route)
      .then((res) => res.json())
      .then((data) => {
        setApartments(data.apartments);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching apartments:", err);
        setLoading(false);
      });
  }, []);

  const addReview = async (apartmentId, reviewData) => {
    try {
      // You could add a specific `isReviewSubmitting` state here if you want
      // to show a loader only for review submission, distinct from general `loading`.
      // For now, I'll omit `setLoading(true)` here to keep it focused on the initial fetch.

      // Step 1: Insert the review into your 'reviews' table in Supabase
      // IMPORTANT: Adjust 'reviews' table name and column names ('apartment_id', 'author', 'rating', 'text_review', 'tags')
      // to match your actual Supabase schema.
      const { data: newReviewRows, error } = await supabase
        .from('reviews') // <--- Your Supabase reviews table name
        .insert({
          apartment_id: parseInt(apartmentId), // Ensure apartment_id is correct type (e.g., integer)
          author: reviewData.author,
          rating: reviewData.rating,
          text_review: reviewData.text_review,
          tags: reviewData.tags, // Supabase can handle array of strings directly for 'text[]' or JSONB
        })
        .select(); // Use .select() to get the inserted row back, including auto-generated IDs, etc.

      if (error) {
        console.error("Supabase error adding review:", error);
        throw new Error(error.message || "Could not add review to database.");
      }

      console.log("Review successfully inserted into Supabase:", newReviewRows);

      // Supabase's insert().select() returns an array of rows. We usually expect one.
      const addedReview = newReviewRows[0];

      // Step 2: Update local state to reflect the new review
      // This is crucial for your UI to update immediately without a full page refresh
      setApartments(prevApartments => {
        return prevApartments.map(item => {
          if (String(item.apartment.id) === String(apartmentId)) {
            // Found the target apartment, update its reviews array in local state
            return {
              ...item,
              apartment: {
                ...item.apartment,
                // Ensure reviews array exists, then add the new review from Supabase
                reviews: item.apartment.reviews ? [...item.apartment.reviews, addedReview] : [addedReview]
              }
            };
          }
          return item; // Return other apartments unchanged
        });
      });

      console.log("Local state updated with new review.");

    } catch (error) {
      console.error("Error in addReview function:", error);
      throw error; // Re-throw the error so the calling component (WriteReview) can catch it
    }
  };
  // --- END MODIFIED addReview FUNCTION ---

  return (
    <ApartmentContext.Provider value={{ apartments, loading, addReview }}>
      {children}
    </ApartmentContext.Provider>
  );
};

export const useApartments = () => useContext(ApartmentContext);
