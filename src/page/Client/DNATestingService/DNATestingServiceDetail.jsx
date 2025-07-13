import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchServiceById } from "../../../service/dnaServiceService";
import "./DNATestingServiceDetail.scss";

const DNATestingServiceDetail = () => {
  const { id: serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbacks, setFeedbacks] = useState([]); // Danh sách feedback

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchServiceById(serviceId);
        console.log("data", data);
        setService(data);
        // Giả lập fetch danh sách feedback (thay bằng API thực tế)
        const mockFeedbacks = [
          {
            id: 1,
            text: "Dịch vụ rất tốt, đáng tiền!",
            user: "User1",
            date: "2025-07-12",
          },
          {
            id: 2,
            text: "Chất lượng ổn, nhưng cần cải thiện thời gian xử lý.",
            user: "User2",
            date: "2025-07-11",
          },
        ];
        setFeedbacks(mockFeedbacks);
      } catch (err) {
        setError("Could not load service details.");
      } finally {
        setLoading(false);
      }
    };
    if (serviceId) fetchData();
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
        {feedbacks.length > 0 ? (
          <div className="feedback-list">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback-item">
                <p className="feedback-text">{feedback.text}</p>
                <p className="feedback-meta">
                  <span className="feedback-user">{feedback.user}</span> -{" "}
                  <span className="feedback-date">{feedback.date}</span>
                </p>
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
