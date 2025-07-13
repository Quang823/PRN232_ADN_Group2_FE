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
import { addTestPersons } from "../../../service/testPersonService";

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
  const [testPersonsModal, setTestPersonsModal] = useState(null); // { appointmentId, totalPrice, checkoutUrl }
  const [testPersonsData, setTestPersonsData] = useState([
    { fullName: "", gender: "", relationship: "" },
    { fullName: "", gender: "", relationship: "" },
  ]);
  const [testPersonsLoading, setTestPersonsLoading] = useState(false);

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
                                setSelectedDate(new Date()); // luôn lấy ngày hiện tại
                                setBookingMessage("");
                                setIsHomeKit(false);
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
                      "Booking successful! Please enter test persons information."
                    );
                    // Hiện modal nhập test persons, truyền appointmentId, totalPrice, checkoutUrl
                    setTestPersonsModal({
                      appointmentId: appointmentRes.appointmentId,
                      totalPrice: appointmentRes.totalPrice,
                      checkoutUrl: null, // sẽ lấy sau khi tạo payment
                    });
                    setBookingModal(null);
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
                  <input
                    value={
                      selectedDate ? selectedDate.toLocaleDateString() : ""
                    }
                    disabled
                    style={{ background: "#f3f4f6", color: "#222" }}
                  />
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
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal nhập test persons */}
        {testPersonsModal && (
          <div
            className="modal-overlay"
            onClick={() => setTestPersonsModal(null)}
          >
            <div
              className="modal service-modal test-person-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "#2d3a4b",
                    marginBottom: 8,
                  }}
                >
                  Enter Test Persons Information
                </h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setTestPersonsModal(null)}
                >
                  ×
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setTestPersonsLoading(true);
                  try {
                    // Gọi API 1 lần, truyền mảng 2 người
                    await addTestPersons([
                      {
                        fullName: testPersonsData[0].fullName,
                        gender: testPersonsData[0].gender === "true",
                        relationship: testPersonsData[0].relationship,
                        appointmentId: testPersonsModal.appointmentId,
                      },
                      {
                        fullName: testPersonsData[1].fullName,
                        gender: testPersonsData[1].gender === "true",
                        relationship: testPersonsData[1].relationship,
                        appointmentId: testPersonsModal.appointmentId,
                      },
                    ]);
                    // Sau khi thành công, tạo payment và chuyển sang checkout
                    const paymentRes = await addPayment({
                      appointmentId: testPersonsModal.appointmentId,
                      price: testPersonsModal.totalPrice,
                    });
                    if (paymentRes) {
                      sessionStorage.setItem(
                        "payment",
                        JSON.stringify(paymentRes)
                      );
                      if (paymentRes.checkoutUrl) {
                        ToastManager.showSuccess(
                          "Booking successful! Redirecting to payment..."
                        );
                        setTestPersonsModal(null);
                        window.location.href = paymentRes.checkoutUrl;
                        return;
                      }
                    }
                    ToastManager.showSuccess("Booking successful!");
                    setTestPersonsModal(null);
                  } catch (err) {
                    ToastManager.showError(
                      err.message || "Failed to add test persons"
                    );
                  } finally {
                    setTestPersonsLoading(false);
                  }
                }}
                className="test-person-form"
                style={{
                  display: "flex",
                  gap: 24,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="test-person-col"
                    style={{
                      flex: 1,
                      minWidth: 220,
                      background: "#fafbff",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      padding: 18,
                      marginBottom: 8,
                    }}
                  >
                    <h4
                      style={{
                        marginBottom: 12,
                        fontWeight: 600,
                        color: "#3b4256",
                        fontSize: "1.08rem",
                      }}
                    >
                      Person {i + 1}
                    </h4>
                    <label
                      className="test-person-label"
                      style={{
                        fontWeight: 500,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      Full Name
                      <input
                        className="test-person-input"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          marginBottom: 10,
                          fontSize: "1rem",
                        }}
                        type="text"
                        value={testPersonsData[i].fullName}
                        onChange={(e) =>
                          setTestPersonsData((data) => {
                            const arr = [...data];
                            arr[i].fullName = e.target.value;
                            return arr;
                          })
                        }
                        required
                      />
                    </label>
                    <label
                      className="test-person-label"
                      style={{
                        fontWeight: 500,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      Gender
                      <select
                        className="test-person-input"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          marginBottom: 10,
                          fontSize: "1rem",
                          background: "#fff",
                        }}
                        value={testPersonsData[i].gender}
                        onChange={(e) =>
                          setTestPersonsData((data) => {
                            const arr = [...data];
                            arr[i].gender = e.target.value;
                            return arr;
                          })
                        }
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                      </select>
                    </label>
                    <label
                      className="test-person-label"
                      style={{
                        fontWeight: 500,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      Relationship
                      <input
                        className="test-person-input"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          marginBottom: 10,
                          fontSize: "1rem",
                        }}
                        type="text"
                        value={testPersonsData[i].relationship}
                        onChange={(e) =>
                          setTestPersonsData((data) => {
                            const arr = [...data];
                            arr[i].relationship = e.target.value;
                            return arr;
                          })
                        }
                        required
                      />
                    </label>
                  </div>
                ))}
                <div
                  className="test-person-actions"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setTestPersonsModal(null)}
                    className="cancel-btn"
                    disabled={testPersonsLoading}
                    style={{ minWidth: 110 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={testPersonsLoading}
                    style={{
                      minWidth: 180,
                      fontWeight: 600,
                      fontSize: "1.08rem",
                    }}
                  >
                    {testPersonsLoading
                      ? "Saving..."
                      : "Save & Continue to Payment"}
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
