import React, { useEffect, useState } from "react";
import { fetchFilteredAppointments } from "../../../service/appointmentService";
import { fetchServiceById } from "../../../service/dnaServiceService";
import { getUserProfile } from "../../../service/authService";
import { fetchSamplesByAppointmentId } from "../../../service/sampleService";
import { fetchTestPersonById } from "../../../service/testPersonService";
import { submitTestResult } from "../../../service/testResultService";
import "./AppointmentDashboard.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const STATUS_OPTIONS = [
  { value: null, label: "All" },
  { value: 0, label: "Pending" },
  { value: 1, label: "WaitingToCollect" },
  { value: 2, label: "InProgress" },
  { value: 3, label: "Completed" },
  { value: 4, label: "Collected" },
];
const HOMEKIT_OPTIONS = [
  { value: null, label: "All" },
  { value: true, label: "HomeKit" },
  { value: false, label: "OnSite" },
];

// Helper để map status sang class và label
const STATUS_LABELS = {
  Pending: { label: "Pending", className: "status-badge status-pending" },
  WaitingToCollect: {
    label: "WaitingToCollect",
    className: "status-badge status-waiting",
  },
  InProgress: {
    label: "InProgress",
    className: "status-badge status-inprogress",
  },
  Completed: { label: "Completed", className: "status-badge status-completed" },
  Collected: { label: "Collected", className: "status-badge status-collected" },
};

function renderStatusBadge(status) {
  const s = STATUS_LABELS[status] || {
    label: status,
    className: "status-badge",
  };
  return <span className={s.className}>{s.label}</span>;
}
function renderHomeKitBadge(isHomeKit) {
  return isHomeKit ? (
    <span className="homekit-badge">HomeKit</span>
  ) : (
    <span className="onsite-badge">OnSite</span>
  );
}

const RELATIONSHIP_OPTIONS = [
  { value: "", label: "Select relationship" },
  { value: "Self", label: "Self" },
  { value: "Spouse", label: "Spouse" },
  { value: "Child", label: "Child" },
  { value: "Parent", label: "Parent" },
  { value: "Sibling", label: "Sibling" },
  { value: "Other", label: "Other" },
];

const AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [isHomeKit, setIsHomeKit] = useState(null);
  const [serviceNames, setServiceNames] = useState({});
  const [userProfiles, setUserProfiles] = useState({});
  const [searchDate, setSearchDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [personInfos, setPersonInfos] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultDate, setResultDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [relationshipType, setRelationshipType] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(null);

  useEffect(() => {
    if (relationshipType && isConfirmed !== null) {
      setDescription(
        `Relationship: ${relationshipType}. Confirmed: ${
          isConfirmed ? "Yes" : "No"
        }.`
      );
    }
    // eslint-disable-next-line
  }, [relationshipType, isConfirmed]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFilteredAppointments({ status, isHomeKit });
        setAppointments(data);
        // Fetch service names and user profiles in parallel
        const serviceIds = [...new Set(data.map((a) => a.serviceId))];
        const userIds = [...new Set(data.map((a) => a.userId))];
        const servicePromises = serviceIds.map(async (id) => {
          try {
            const s = await fetchServiceById(id);
            return { id, name: s.name };
          } catch {
            return { id, name: "Unknown" };
          }
        });
        const userPromises = userIds.map(async (id) => {
          try {
            const u = await getUserProfile(id);
            return { id, fullName: u.fullName, avatarUrl: u.avatarUrl };
          } catch {
            return { id, fullName: "Unknown", avatarUrl: null };
          }
        });
        const serviceResults = await Promise.all(servicePromises);
        const userResults = await Promise.all(userPromises);
        setServiceNames(
          Object.fromEntries(serviceResults.map((s) => [s.id, s.name]))
        );
        setUserProfiles(
          Object.fromEntries(
            userResults.map((u) => [
              u.id,
              { fullName: u.fullName, avatarUrl: u.avatarUrl },
            ])
          )
        );
      } catch {
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [status, isHomeKit]);

  const filteredAppointments = searchDate
    ? appointments.filter(
        (a) =>
          a.scheduleDate &&
          a.scheduleDate.slice(0, 10) === format(searchDate, "yyyy-MM-dd")
      )
    : appointments;

  const handleAppointmentClick = async (appointmentId) => {
    setShowModal(true);
    setModalLoading(true);
    setModalError("");
    setPersonInfos([]);
    setCurrentAppointmentId(appointmentId);
    try {
      const samples = await fetchSamplesByAppointmentId(appointmentId);
      const personIds = samples.map((s) => s.personId).filter(Boolean);
      const personPromises = personIds.map((id) => fetchTestPersonById(id));
      const persons = await Promise.all(personPromises);
      setPersonInfos(persons);
    } catch (err) {
      setModalError("Unable to get test person information!");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="ap-container">
      <div className="ap-header-actions">
        <div className="ap-search-section">
          <div className="ap-search-wrapper">
            <span className="ap-table-title">Appointment Dashboard</span>
          </div>
        </div>
        <div className="ap-action-buttons" style={{ gap: 16 }}>
          <select
            className="ap-filter-select"
            value={status ?? ""}
            onChange={(e) =>
              setStatus(e.target.value === "" ? null : Number(e.target.value))
            }
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value ?? "all"} value={opt.value ?? ""}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="ap-filter-select"
            value={isHomeKit === null ? "" : isHomeKit ? "true" : "false"}
            onChange={(e) => {
              const val = e.target.value;
              setIsHomeKit(val === "" ? null : val === "true");
            }}
          >
            {HOMEKIT_OPTIONS.map((opt) => (
              <option
                key={String(opt.value)}
                value={opt.value === null ? "" : String(opt.value)}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="appointment-date-search">
        <label htmlFor="appointment-date">Search by date:</label>
        <DatePicker
          id="appointment-date"
          selected={searchDate}
          onChange={(date) => setSearchDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="ap-filter-select"
          isClearable
        />
      </div>
      <div className="ap-table-card">
        <div className="ap-table-header">
          <div className="ap-table-title">
            Appointment List ({filteredAppointments.length})
          </div>
        </div>
        <div className="ap-table-wrapper">
          <table className="ap-table">
            <thead>
              <tr className="ap-table-row-header">
                <th className="ap-table-header-cell">User</th>
                <th className="ap-table-header-cell">Service</th>
                <th className="ap-table-header-cell">Status</th>
                <th className="ap-table-header-cell">HomeKit</th>
                <th className="ap-table-header-cell">Schedule Date</th>
                <th className="ap-table-header-cell">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="ap-table-loading">
                          <div className="ap-loading-pulse">
                            <div className="ap-loading-avatar"></div>
                            <div className="ap-loading-text">
                              <div className="ap-loading-line ap-loading-line-short"></div>
                              <div className="ap-loading-line ap-loading-line-medium"></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                : filteredAppointments.map((a) => (
                    <tr
                      key={a.appointmentId}
                      className="ap-table-row"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAppointmentClick(a.appointmentId)}
                    >
                      <td className="ap-table-cell">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {userProfiles[a.userId]?.avatarUrl && (
                            <img
                              src={userProfiles[a.userId].avatarUrl}
                              alt="avatar"
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                              }}
                            />
                          )}
                          <span>
                            {userProfiles[a.userId]?.fullName || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="ap-table-cell">
                        {serviceNames[a.serviceId] || "Unknown"}
                      </td>
                      <td className="ap-table-cell">
                        {renderStatusBadge(a.status)}
                      </td>
                      <td className="ap-table-cell">
                        {renderHomeKitBadge(a.isHomeKit)}
                      </td>
                      <td className="ap-table-cell">
                        {a.scheduleDate?.slice(0, 10)}
                      </td>
                      <td className="ap-table-cell">{a.totalPrice}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal hiển thị thông tin test person */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowModal(false);
            setShowResultModal(false);
          }}
        >
          <div
            className={`modal service-modal appointment-modal${
              showResultModal ? " blurred" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 600 }}
          >
            <div className="modal-header">
              <h3>Testee Information</h3>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowModal(false);
                  setShowResultModal(false);
                }}
              >
                ×
              </button>
            </div>
            {!showResultModal && (
              <>
                {modalLoading ? (
                  <div style={{ padding: 32, textAlign: "center" }}>
                    Loading...
                  </div>
                ) : modalError ? (
                  <div className="error">{modalError}</div>
                ) : (
                  <div className="appointment-modal-content">
                    {personInfos.map((p, idx) => (
                      <div
                        key={p.personId || idx}
                        className="appointment-person-card"
                      >
                        <div className="appointment-person-avatar">
                          <svg
                            width="38"
                            height="38"
                            viewBox="0 0 38 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="19" cy="19" r="19" fill="#6366f1" />
                            <path
                              d="M19 20.5c3.59 0 6.5-2.91 6.5-6.5S22.59 7.5 19 7.5 12.5 10.41 12.5 14s2.91 6.5 6.5 6.5Zm0 2.5c-4.14 0-12.5 2.08-12.5 6.25V32h25v-2.75c0-4.17-8.36-6.25-12.5-6.25Z"
                              fill="#fff"
                            />
                          </svg>
                        </div>
                        <div className="appointment-person-name">
                          {p.fullName}
                        </div>
                        <div className="appointment-person-label">
                          Gender:{" "}
                          <span className="appointment-person-value">
                            {p.gender === true
                              ? "Male"
                              : p.gender === false
                              ? "Female"
                              : "-"}
                          </span>
                        </div>
                        <div className="appointment-person-label">
                          Relationship:{" "}
                          <span className="appointment-person-value">
                            {p.relationship || "-"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ textAlign: "center" }}>
                  <button
                    className="submit-btn appointment-modal-btn"
                    style={{ minWidth: 180 }}
                    disabled={modalLoading}
                    onClick={() => setShowResultModal(true)}
                  >
                    Enter Result
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {showResultModal && (
        <div
          className="modal-overlay"
          style={{ zIndex: 2000 }}
          onClick={() => setShowResultModal(false)}
        >
          <div
            className="modal service-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <div className="modal-header">
              <h3>Enter Test Result</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowResultModal(false)}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitLoading(true);
                setSubmitError("");
                setSubmitSuccess("");
                const payload = {
                  appointmentId: currentAppointmentId,
                  resultDate:
                    resultDate instanceof Date
                      ? resultDate.toISOString()
                      : resultDate,
                  description: String(description || ""),
                };
                console.log("[SubmitTestResult] Payload:", payload);
                try {
                  await submitTestResult(payload);
                  setSubmitSuccess("Result submitted successfully!");
                  setTimeout(() => setShowResultModal(false), 1200);
                } catch (err) {
                  setSubmitError(err.message || "Failed to submit result");
                } finally {
                  setSubmitLoading(false);
                }
              }}
              className="appointment-modal-content"
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <label>
                Relationship Type:
                <select
                  value={relationshipType}
                  onChange={(e) => setRelationshipType(e.target.value)}
                  required
                >
                  <option value="">Select relationship</option>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Relationship Confirmed?
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="confirmed"
                      value="yes"
                      checked={isConfirmed === true}
                      onChange={() => setIsConfirmed(true)}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="confirmed"
                      value="no"
                      checked={isConfirmed === false}
                      onChange={() => setIsConfirmed(false)}
                    />{" "}
                    No
                  </label>
                </div>
              </label>
              <label>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </label>
              {submitError && <div className="error">{submitError}</div>}
              {submitSuccess && (
                <div style={{ color: "#22c55e", fontWeight: 600 }}>
                  {submitSuccess}
                </div>
              )}
              <button
                type="submit"
                className="submit-btn appointment-modal-btn"
                disabled={submitLoading}
              >
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AppointmentDashboard;
