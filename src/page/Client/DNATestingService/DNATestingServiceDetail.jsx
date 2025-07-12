import React from "react";
import "./DNATestingServiceDetail.scss";
const DNAServiceDetail = () => {
  return (
    <div className="dna-service-detail-container">
      <div className="animated-background">
        <div className="dna-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
        <div className="dna-helix-bg">
          <div className="helix-strand strand-1"></div>
          <div className="helix-strand strand-2"></div>
        </div>
      </div>
      {/* Header Section */}
      <header className="header">
        <h1 className="header-title">DNA Analysis Service</h1>
        <p className="header-subtitle">
          Discover your origins and health insights through DNA
        </p>
      </header>

      {/* Video Section */}
      <section className="video-section">
        <h2 className="section-title">Service Introduction</h2>
        <div className="video-wrapper">
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/sample-video-id"
            title="DNA Service Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Information Section */}
      <section className="info-section">
        <h2 className="section-title">Service Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <h3>Processing Time</h3>
            <p>3-5 business days</p>
          </div>
          <div className="info-item">
            <h3>Accuracy</h3>
            <p>99.9%</p>
          </div>
          <div className="info-item">
            <h3>Method</h3>
            <p>Advanced gene sequencing technology</p>
          </div>
          <div className="info-item">
            <h3>Support</h3>
            <p>24/7 expert consultation</p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="description-section">
        <h2 className="section-title">Service Description</h2>
        <p className="description-text">
          Our DNA analysis service provides deep insights into your genetic
          origins, health risks, and personalized traits. Using cutting-edge
          technology, we analyze your DNA sample to deliver a detailed,
          easy-to-understand report, empowering you to make informed decisions
          about your health and lifestyle.
        </p>
        <p className="description-text">
          Our process includes at-home sample collection, analysis in an
          internationally certified laboratory, and secure online result
          delivery. You'll receive expert support to fully understand your
          results.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2 className="section-title">Service Benefits</h2>
        <ul className="benefits-list">
          <li>
            Discover your ancestral origins from over 1,000 regions worldwide.
          </li>
          <li>
            Identify potential genetic health risks for proactive prevention.
          </li>
          <li>
            Personalize your nutrition and fitness plans based on your DNA.
          </li>
          <li>Receive a detailed report with a user-friendly interface.</li>
          <li>Ensure data privacy with high-level encryption.</li>
        </ul>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="section-title">Get Started Today</h2>
        <button className="cta-button">Sign Up for the Service</button>
      </section>
    </div>
  );
};

export default DNAServiceDetail;
