import React, { useEffect } from "react";
import "./Homepage.scss";

const Homepage = () => {
  return (
    <div className="homepage-container">
      {/* Animated Background */}
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

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Discover</span>
              <span className="title-line">The Secrets</span>
              <span className="title-line highlight">Of Your DNA</span>
            </h1>
            <p className="hero-subtitle">
              The most advanced DNA testing technology, providing accurate
              insights into your genetics and health.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" id="startTestBtn">
                <span>Start Testing</span>
                <div className="btn-glow"></div>
              </button>
              <button className="btn-secondary">
                <span>Learn More</span>
              </button>
            </div>
          </div>
          <div className="hp-hero-visual">
            <div className="hp-dna-model">
              <div className="hp-dna-double-helix">
                <div className="hp-helix-wrapper">
                  <div className="hp-helix-strand left-strand"></div>
                  <div className="hp-helix-strand right-strand"></div>
                  <div className="hp-base-pairs">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`hp-base-pair-line line-${i + 1}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span>Scroll Down</span>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Professional DNA testing packages with high accuracy
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card" data-service="ancestry">
              <div className="card-icon">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="icon-bg" />
                  <path
                    d="M30 30 L70 30 L70 70 L30 70 Z"
                    className="icon-shape"
                  />
                </svg>
              </div>
              <h3>Ancestry Testing</h3>
              <p>
                Explore your ancestry and ethnic origins through detailed DNA
                analysis.
              </p>
              <div className="card-features">
                <span>✓ Analysis of 500+ regions</span>
                <span>✓ Detailed ancestry report</span>
                <span>✓ Connect with distant relatives</span>
              </div>
              <button className="card-btn">Choose This Package</button>
            </div>

            <div className="service-card" data-service="health">
              <div className="card-icon">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="icon-bg" />
                  <path d="M50 20 L60 40 L40 40 Z" className="icon-shape" />
                </svg>
              </div>
              <h3>Health Testing</h3>
              <p>
                Assess your risk of genetic diseases and receive personalized
                health advice.
              </p>
              <div className="card-features">
                <span>✓ Analysis of 200+ genetic diseases</span>
                <span>✓ Personalized nutrition advice</span>
                <span>✓ Health care plan</span>
              </div>
              <button className="card-btn">Choose This Package</button>
            </div>

            <div className="service-card" data-service="traits">
              <div className="card-icon">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="icon-bg" />
                  <path
                    d="M25 50 Q50 25 75 50 Q50 75 25 50"
                    className="icon-shape"
                  />
                </svg>
              </div>
              <h3>Personal Traits</h3>
              <p>
                Learn about physical traits and personality influenced by your
                genes.
              </p>
              <div className="card-features">
                <span>✓ Analysis of 100+ traits</span>
                <span>✓ Sports tendencies</span>
                <span>✓ Personality and behavior</span>
              </div>
              <button className="card-btn">Choose This Package</button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About DNALab Aurora</h2>
              <p className="about-description">
                We are a pioneering unit in the field of DNA testing in Vietnam,
                with over 10 years of experience and the most advanced
                technology from the USA and Europe.
              </p>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number" data-target="50000">
                    0
                  </div>
                  <div className="stat-label">Trusted Customers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-target="99.9">
                    0
                  </div>
                  <div className="stat-label">% Accuracy</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-target="15">
                    0
                  </div>
                  <div className="stat-label">Years of Experience</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-target="24">
                    0
                  </div>
                  <div className="stat-label">Support Hours/Day</div>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="lab-animation">
                <div className="petri-dish">
                  <div className="dna-sample"></div>
                  <div className="analysis-lines">
                    <div className="line line-1"></div>
                    <div className="line line-2"></div>
                    <div className="line line-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Testing Process</h2>
            <p className="section-subtitle">Simple, fast, and accurate</p>
          </div>
          <div className="process-timeline">
            <div className="timeline-item">
              <div className="timeline-icon">
                <span>1</span>
              </div>
              <div className="timeline-content">
                <h3>Order Kit</h3>
                <p>
                  Order online or visit a store to receive your testing kit.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <span>2</span>
              </div>
              <div className="timeline-content">
                <h3>Collect Sample</h3>
                <p>
                  Use the cotton swab to collect a saliva sample at home
                  following the instructions.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <span>3</span>
              </div>
              <div className="timeline-content">
                <h3>Send Sample</h3>
                <p>Package and send the sample to the lab via mail.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <span>4</span>
              </div>
              <div className="timeline-content">
                <h3>Receive Results</h3>
                <p>
                  Receive a detailed report via email after 2-3 weeks of
                  processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2 className="section-title">Contact Us</h2>
              <p>Have questions? We are always ready to assist you!</p>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h4>Email</h4>
                    <p>info@dnalabaurora.vn</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div>
                    <h4>Phone</h4>
                    <p>1900 1234 56</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h4>Address</h4>
                    <p>123 ABC Street, District 1, Ho Chi Minh City</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form id="contactForm">
                <div className="form-group">
                  <input type="text" placeholder="Full Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Phone Number" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
