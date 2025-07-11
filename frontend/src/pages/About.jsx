import React from "react";
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <h4>We are Aggie Housing!</h4>
      <p>
        Aggie Housing is your trusted guide for finding the perfect off-campus apartment. Built by students, for students, our mission is to simplify the stressful apartment search process and help you make confident, informed decisions about your future Aggie home.
        <br /><br />
        We know that choosing your first apartment can be overwhelming— especially when you're experiencing campus life for the first time.
      </p>
      <p>
        Our platform is designed specifically with UC Davis students in mind, helping you filter out the noise and focus on what matters most: a comfortable, reliable place to call home. Whether you're a transfer student leaving home for the first time or a sophomore ready to leave the dorms, Aggie Housing is here to support you at every step of your housing journey.
      </p>
      
      {/* ✅ Insert image here */}
      <img
        src="/moovein.png"
        alt="Aggie Housing banner"
        className="about-image"
      />
    </div>
  );
}

export default About;
