import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchServiceById } from "../../../service/dnaServiceService";
import { fetchFeedbacksByServiceId } from "../../../service/feedbackService";
import "./DNATestingServiceDetail.scss";

const DNATestingServiceDetail = () => {
  const { id: serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbacks, setFeedbacks] = useState([]); // Danh sách feedback
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);
  const [feedbacksError, setFeedbacksError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchServiceById(serviceId);
        setService(data);
      } catch (err) {
        setError("Could not load service details.");
      } finally {
        setLoading(false);
      }
    };
    if (serviceId) fetchData();
  }, [serviceId]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setFeedbacksLoading(true);
      setFeedbacksError("");
      try {
        const data = await fetchFeedbacksByServiceId(serviceId);
        setFeedbacks(data);
      } catch (err) {
        setFeedbacksError(err.message || "Could not load feedbacks.");
      } finally {
        setFeedbacksLoading(false);
      }
    };
    if (serviceId) fetchFeedbacks();
  }, [serviceId]);

  if (loading)
    return (
      <div className="dna-service-detail-container">
        <div className="service-loading">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="dna-service-detail-container">
        <div className="service-error">{error}</div>
      </div>
    );
  if (!service) return null;

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
      <header className="header">
        <h1 className="header-title">{service.name}</h1>
        <p className="header-subtitle">{service.type}</p>
      </header>
      <section className="service-main-info">
        {service.url && (
          <div className="service-img-wrapper">
            <img src={service.url} alt={service.name} className="service-img" />
          </div>
        )}
        <div className="service-info-list">
          <div className="service-info-item">
            <span className="service-info-label">Description:</span>
            <span className="service-info-value">{service.description}</span>
          </div>
          <div className="service-info-item">
            <span className="service-info-label">Allow HomeKit:</span>
            <span className="service-info-value">
              {service.allowHomeKit ? "Yes" : "No"}
            </span>
          </div>
          <div className="service-info-item">
            <span className="service-info-label">Price:</span>
            <span className="service-info-value">
              {service.price?.toLocaleString()} VND
            </span>
          </div>
          <div className="service-info-item">
            <span className="service-info-label">Created At:</span>
            <span className="service-info-value">
              {service.createdAt?.slice(0, 10)}
            </span>
          </div>
        </div>
      </section>
      <section className="feedback-section">
        <h2 className="section-title">Feedbacks</h2>
        {feedbacksLoading ? (
          <div className="service-loading">Loading feedbacks...</div>
        ) : feedbacksError ? (
          <div className="service-error">{feedbacksError}</div>
        ) : feedbacks.length > 0 ? (
          <div className="feedback-list">
            {feedbacks.map((fb) => (
              <div key={fb.feedbackId} className="feedback-item">
                <div className="feedback-user-info">
                  {fb.avatarUrl && (
                    <img
                      src={fb.avatarUrl}
                      alt={fb.fullName}
                      className="feedback-avatar"
                    />
                  )}
                  <div>
                    <span className="feedback-user">{fb.fullName}</span>
                    <span className="feedback-date">
                      {fb.createdAt?.slice(0, 10) || fb.date}
                    </span>
                  </div>
                </div>
                <div className="feedback-rating">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <span key={i} style={{ color: "#fbbf24", fontSize: 18 }}>
                      ★
                    </span>
                  ))}
                  {Array.from({ length: 5 - fb.rating }).map((_, i) => (
                    <span key={i} style={{ color: "#e5e7eb", fontSize: 18 }}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="feedback-text">{fb.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-feedback">No feedback available yet.</p>
        )}
      </section>
    </div>
  );
};

export default DNATestingServiceDetail;
