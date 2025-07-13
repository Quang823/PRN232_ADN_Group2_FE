import React, { useEffect, useState } from "react";
import { fetchAppointmentsOfUser } from "../../../service/appointmentService";
import { fetchPaymentsOfUser } from "../../../service/paymentService";
import { addFeedback } from "../../../service/feedbackService";
import "./BookingHistoryPage.scss";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "WaitingToCollect", label: "Waiting to Collect" },
  { value: "Completed", label: "Completed" },
];
const paymentStatusOptions = [
  { value: "", label: "All Status" },
  { value: "Success", label: "Success" },
  { value: "Failed", label: "Failed" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString();
};

const formatStatus = (status) => {
  switch (status) {
    case "Pending":
      return <span className="status pending">Pending</span>;
    case "WaitingToCollect":
      return <span className="status waiting">Waiting to Collect</span>;
    case "Completed":
      return <span className="status completed">Completed</span>;
    default:
      return <span className="status">{status}</span>;
  }
};
const formatPaymentStatus = (status) => {
  switch (status) {
    case "Success":
      return <span className="status completed">Success</span>;
    case "Failed":
      return <span className="status failed">Failed</span>;
    default:
      return <span className="status">{status}</span>;
  }
};
const formatHomeKit = (v) =>
  v ? <span className="yes">Yes</span> : <span className="no">No</span>;

export default function BookingHistoryPage() {
  const [tab, setTab] = useState("booking");
  // Booking
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  // Payment
  const [payData, setPayData] = useState([]);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [payFrom, setPayFrom] = useState("");
  const [payTo, setPayTo] = useState("");
  const [feedbackModal, setFeedbackModal] = useState(null); // { appointment }
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        const userId = user?.id;
        if (!userId) throw new Error("User not logged in");
        const res = await fetchAppointmentsOfUser(userId);
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load booking history");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (tab === "payment" && payData.length === 0 && !payLoading) {
      const fetchPay = async () => {
        setPayLoading(true);
        setPayError("");
        try {
          const user = JSON.parse(sessionStorage.getItem("user") || "{}");
          const userId = user?.id;
          if (!userId) throw new Error("User not logged in");
          const res = await fetchPaymentsOfUser(userId);
          setPayData(res);
        } catch (err) {
          setPayError(err.message || "Failed to load payment history");
        } finally {
          setPayLoading(false);
        }
      };
      fetchPay();
    }
  }, [tab]);

  // Filter logic
  const filteredData = data.filter((row) => {
    let ok = true;
    if (statusFilter && row.status !== statusFilter) ok = false;
    if (fromDate && new Date(row.scheduleDate) < new Date(fromDate)) ok = false;
    if (toDate && new Date(row.scheduleDate) > new Date(toDate)) ok = false;
    return ok;
  });
  const filteredPay = payData.filter((row) => {
    let ok = true;
    if (payStatus && row.status !== payStatus) ok = false;
    if (payFrom && new Date(row.paymentDate) < new Date(payFrom)) ok = false;
    if (payTo && new Date(row.paymentDate) > new Date(payTo)) ok = false;
    return ok;
  });

  return (
    <div className="booking-history-container">
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
      <h2 className="bh-title">Booking & Payment History</h2>
      <div className="bh-tab-bar">
        <button
          className={tab === "booking" ? "active" : ""}
          onClick={() => setTab("booking")}
        >
          Booking History
        </button>
        <button
          className={tab === "payment" ? "active" : ""}
          onClick={() => setTab("payment")}
        >
          Payment History
        </button>
      </div>
      {tab === "booking" && (
        <>
          <div className="bh-filter-bar">
            <select
              className="bh-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="bh-filter-date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="From date"
            />
            <input
              type="date"
              className="bh-filter-date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="To date"
            />
          </div>
          {loading ? (
            <div className="bh-loading">Loading...</div>
          ) : error ? (
            <div className="bh-error">{error}</div>
          ) : filteredData.length === 0 ? (
            <div className="bh-empty">No booking history found.</div>
          ) : (
            <div className="bh-table-wrapper">
              <table className="bh-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Schedule Date</th>
                    <th>Status</th>
                    <th>Home Kit</th>
                    <th>Booking Date</th>
                    <th>Total Price (VND)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{formatDate(row.scheduleDate)}</td>
                      <td>{formatStatus(row.status)}</td>
                      <td>{formatHomeKit(row.isHomeKit)}</td>
                      <td>{formatDate(row.bookingDate)}</td>
                      <td>{row.totalPrice?.toLocaleString()}</td>
                      <td>
                        {row.status === "Completed" && (
                          <button
                            className="feedback-btn-action"
                            onClick={() => {
                              setFeedbackModal(row);
                              setFeedbackComment("");
                              setFeedbackRating(0);
                              setFeedbackError("");
                              setFeedbackSuccess(false);
                            }}
                          >
                            Feedback
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {tab === "payment" && (
        <>
          <div className="bh-filter-bar">
            <select
              className="bh-filter-select"
              value={payStatus}
              onChange={(e) => setPayStatus(e.target.value)}
            >
              {paymentStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="bh-filter-date"
              value={payFrom}
              onChange={(e) => setPayFrom(e.target.value)}
              placeholder="From date"
            />
            <input
              type="date"
              className="bh-filter-date"
              value={payTo}
              onChange={(e) => setPayTo(e.target.value)}
              placeholder="To date"
            />
          </div>
          {payLoading ? (
            <div className="bh-loading">Loading...</div>
          ) : payError ? (
            <div className="bh-error">{payError}</div>
          ) : filteredPay.length === 0 ? (
            <div className="bh-empty">No payment history found.</div>
          ) : (
            <div className="bh-table-wrapper">
              <table className="bh-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Paid Date</th>
                    <th>Amount (VND)</th>
                    <th>Status</th>
                    <th>Appointment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPay.map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{formatDate(row.paidDate)}</td>
                      <td>{row.amount?.toLocaleString()}</td>
                      <td>{formatPaymentStatus(row.status)}</td>
                      <td>{row.appointmentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {feedbackModal && (
        <div
          className="feedback-modal-overlay"
          onClick={() => setFeedbackModal(null)}
        >
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-modal-header">
              <h3>Service Feedback</h3>
              <button
                className="modal-close-btn"
                onClick={() => setFeedbackModal(null)}
              >
                ×
              </button>
            </div>
            <form
              className="feedback-form-modal"
              onSubmit={async (e) => {
                e.preventDefault();
                setFeedbackLoading(true);
                setFeedbackError("");
                try {
                  const user = JSON.parse(
                    sessionStorage.getItem("user") || "{}"
                  );
                  await addFeedback({
                    userId: user.id,
                    comment: feedbackComment,
                    rating: feedbackRating,
                    appointmentId: feedbackModal.appointmentId,
                  });
                  setFeedbackSuccess(true);
                  setTimeout(() => {
                    setFeedbackSuccess(false);
                    setFeedbackModal(null);
                  }, 1500);
                } catch (err) {
                  setFeedbackError(err.message || "Failed to submit feedback");
                } finally {
                  setFeedbackLoading(false);
                }
              }}
            >
              <div className="feedback-rating-label">Select rating:</div>
              <div className="feedback-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      "star" + (feedbackRating >= star ? " filled" : "")
                    }
                    onClick={() => setFeedbackRating(star)}
                    role="button"
                    tabIndex={0}
                    style={{ cursor: "pointer", fontSize: 28 }}
                    aria-label={`Select ${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                className="feedback-textarea-modal"
                placeholder="Your feedback about the service..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                required
                rows={3}
              />
              <button
                className="feedback-btn-modal"
                type="submit"
                disabled={feedbackLoading || feedbackRating === 0}
              >
                {feedbackLoading ? "Submitting..." : "Submit Feedback"}
              </button>
              {feedbackError && (
                <div className="feedback-error-modal">{feedbackError}</div>
              )}
              {feedbackSuccess && (
                <div className="feedback-success-modal">
                  Thank you for your feedback!
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
