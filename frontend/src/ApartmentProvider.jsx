// context/ApartmentContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const ApartmentContext = createContext();
const route = "https://apartment-review-website-production.up.railway.app/apartments"
// const route = "http://127.0.0.1:5000/apartments"
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

  return (
    <ApartmentContext.Provider value={{ apartments, loading }}>
      {children}
    </ApartmentContext.Provider>
  );
};

export const useApartments = () => useContext(ApartmentContext);
