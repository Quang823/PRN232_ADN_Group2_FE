import React, { useEffect, useState } from "react";
import { fetchAllServices } from "../../../service/dnaServiceService";
import { addAppointment } from "../../../service/appointmentService";
import {
  Dna,
  CheckCircle,
  HelpCircle,
  Phone,
  FlaskConical,
  Shield,
  Clock,
  Home,
} from "lucide-react";
import "./DNATestingService.scss";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ToastManager from "../../../component/common/Toast/ToastManager";
import { ToastContainer } from "react-toastify";
import { addPayment } from "../../../service/paymentService";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "process", label: "Process" },
  { id: "sample-types", label: "Sample Types" },
  { id: "why-choose", label: "Why Choose Us" },
  { id: "services", label: "Services" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Sidebar() {
  return (
    <nav className="dna-sidebar">
      <div className="sidebar-title">
        <Dna size={20} /> DNA Service
      </div>
      <ul>
        {sections.map((s) => (
          <li key={s.id}>
            <button onClick={() => scrollToSection(s.id)}>{s.label}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function DNATestingService() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingModal, setBookingModal] = useState(null); // {service, date}
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const navigate = useNavigate();
  const [isHomeKit, setIsHomeKit] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await fetchAllServices();
        setServices(data);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Group services by type
  const grouped = services.reduce((acc, s) => {
    if (!acc[s.type]) acc[s.type] = [];
    acc[s.type].push(s);
    return acc;
  }, {});
  const typeOrder = Object.keys(grouped);

  return (
    <div className="dna-service-landing">
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
      <Sidebar />
      <div className="dna-main-content">
        <section id="services" className="dna-section">
          <h2>
            <Dna size={20} /> DNA Testing Services
          </h2>
          <p className="dna-desc">
            We provide reputable, confidential, and fast DNA testing services
            for all civil, administrative, and legal needs.
          </p>
          {loading ? (
            <div className="dna-loading">Loading services...</div>
          ) : typeOrder.length === 0 ? (
            <div className="dna-empty">No services available.</div>
          ) : (
            typeOrder.map(
              (type) =>
                grouped[type].length > 0 && (
                  <div key={type} style={{ marginBottom: 36 }}>
                    <h3
                      style={{
                        color: "#1e40af",
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        marginBottom: 18,
                      }}
                    >
                      {type}
                    </h3>
                    <div
                      className="dna-service-list"
                      style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                    >
                      {grouped[type].map((service) => (
                        <div
                          className="dna-service-card"
                          key={service.serviceId}
                        >
                          <div className="dna-service-header">
                            <h3>{service.name}</h3>
                            <span className="dna-service-type">
                              {service.type}
                            </span>
                          </div>
                          <p className="dna-service-desc">
                            {service.description}
                          </p>
                          <div className="dna-service-info">
                            <span className="dna-service-price">
                              {service.price?.toLocaleString()} VND
                            </span>
                            <span className="dna-service-homekit">
                              {service.allowHomeKit
                                ? "Home sample collection supported"
                                : "Sample collection at facility only"}
                            </span>
                          </div>
                          <div className="dna-service-actions">
                            <button
                              onClick={() =>
                                navigate(`/service/${service.serviceId}`)
                              }
                            >
                              View details
                            </button>
                            <button
                              className="primary-btn"
                              onClick={() => {
                                setSelectedService(service);
                                setBookingModal({ service });
                                setSelectedDate(null);
                                setBookingMessage("");
                                setIsHomeKit(false); // reset khi mở modal
                              }}
                            >
                              Book now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )
          )}
        </section>
        {/* Booking Modal */}
        {bookingModal && (
          <div className="modal-overlay" onClick={() => setBookingModal(null)}>
            <div
              className="modal service-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Book Your Appointment</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setBookingModal(null)}
                >
                  ×
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBookingLoading(true);
                  setBookingMessage("");
                  try {
                    const appointmentRes = await addAppointment({
                      serviceId: bookingModal.service.serviceId,
                      scheduleDate: selectedDate.toISOString(),
                      isHomeKit:
                        bookingModal.service.type === "Dan su"
                          ? isHomeKit
                          : false,
                    });
                    ToastManager.showSuccess(
                      "Booking successful! We will contact you for confirmation."
                    );
                    // Gọi payment ngay sau khi booking thành công
                    try {
                      const { appointmentId, totalPrice } = appointmentRes;
                      if (appointmentId && totalPrice) {
                        const paymentRes = await addPayment({
                          appointmentId,
                          price: totalPrice,
                        });
                        if (paymentRes) {
                          sessionStorage.setItem(
                            "payment",
                            JSON.stringify(paymentRes)
                          );
                          if (paymentRes.checkoutUrl) {
                            window.location.href = paymentRes.checkoutUrl;
                          }
                        }
                      }
                    } catch (err) {
                      ToastManager.showError(
                        err.message ||
                          "Payment link creation failed. Please try again."
                      );
                    }
                    setTimeout(() => setBookingModal(null), 1500);
                  } catch (err) {
                    ToastManager.showError(
                      err.message || "Booking failed. Please try again."
                    );
                  } finally {
                    setBookingLoading(false);
                  }
                }}
                className="service-form"
                style={{ marginTop: 0 }}
              >
                <label>
                  Service
                  <input
                    value={bookingModal.service.name}
                    disabled
                    style={{ background: "#f3f4f6" }}
                  />
                </label>
                <label>
                  Appointment Date
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Choose a date"
                    className="dna-datepicker-input"
                    calendarClassName="dna-datepicker-calendar"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    required
                  />
                  {!selectedDate && (
                    <div className="dna-datepicker-hint">
                      Please select a date to proceed.
                    </div>
                  )}
                </label>
                {bookingModal.service.type === "Dan su" && (
                  <label
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <input
                      type="checkbox"
                      checked={isHomeKit}
                      onChange={() => setIsHomeKit((v) => !v)}
                      style={{ width: 18, height: 18 }}
                    />
                    <span>
                      <Home size={18} style={{ verticalAlign: "middle" }} />{" "}
                      Home sample collection (lấy mẫu tại nhà)
                    </span>
                  </label>
                )}
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setBookingModal(null)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={bookingLoading || !selectedDate}
                  >
                    {bookingLoading ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
