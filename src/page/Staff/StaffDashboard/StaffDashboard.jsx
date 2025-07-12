import React, { useEffect, useState } from "react";
import "./StaffDashboard.scss";
import {
  Users,
  Clock,
  CheckCircle2,
  UserX,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function StaffDashboard() {
  // Thêm biến đếm
  const [approvedCount, setApprovedCount] = useState(
    () => Number(localStorage.getItem("approvedCount")) || 0
  );
  const [rejectedCount, setRejectedCount] = useState(
    () => Number(localStorage.getItem("rejectedCount")) || 0
  );
  const [pendingCount, setPendingCount] = useState(0);

  // Lấy số lượng pending thực tế từ API
  useEffect(() => {
    // Lấy số lượng pending thực tế từ API
    const pendingCertificates = [
      { id: 1, name: "Certificate A", status: "Pending" },
      { id: 2, name: "Certificate B", status: "Pending" },
      { id: 3, name: "Certificate C", status: "Pending" },
    ];
    setPendingCount(pendingCertificates.length);
  }, []);

  // Lưu vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("approvedCount", approvedCount);
  }, [approvedCount]);
  useEffect(() => {
    localStorage.setItem("rejectedCount", rejectedCount);
  }, [rejectedCount]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "approvedCount") setApprovedCount(Number(e.newValue) || 0);
      if (e.key === "rejectedCount") setRejectedCount(Number(e.newValue) || 0);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Hàm xử lý bấm approve/reject
  const handleApprove = () => {
    setApprovedCount((prev) => prev + 1);
    setPendingCount((prev) => (prev > 0 ? prev - 1 : 0));
  };
  const handleReject = () => {
    setRejectedCount((prev) => prev + 1);
    setPendingCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Hàm reset số liệu
  const handleResetCounts = () => {
    setApprovedCount(0);
    setRejectedCount(0);
    localStorage.setItem("approvedCount", 0);
    localStorage.setItem("rejectedCount", 0);
  };

  // Tính toán tổng
  const total = approvedCount + rejectedCount + pendingCount;
  const approvalRate =
    total > 0 ? Math.round((approvedCount / total) * 100) : 0;

  // Dữ liệu cho doughnut chart
  const doughnutData = {
    labels: ["Approved", "Rejected", "Pending Approval"],
    datasets: [
      {
        data: [approvedCount, rejectedCount, pendingCount],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // Approved
          "rgba(255, 99, 132, 0.7)", // Rejected
          "rgba(255, 206, 86, 0.7)", // Pending
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="staff-dashboard">
      {/* Welcome Section */}
      <div className="staff-welcome-section">
        <div className="staff-welcome-overlay"></div>
        <div className="staff-welcome-content">
          <h2 className="staff-welcome-title">Welcome back!</h2>
          <p className="staff-welcome-text">
            There are {pendingCount} accounts pending approval today
          </p>
          <div className="staff-welcome-stats">
            <div className="staff-welcome-stat">
              <Activity className="staff-welcome-icon" />
              <span>Running well</span>
            </div>
            <div className="staff-welcome-stat">
              <TrendingUp className="staff-welcome-icon" />
              <span>12% growth this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="staff-stats-grid">
        <div className="staff-stats-card">
          <div className="staff-card-header">
            <h3 className="staff-card-title">Total Accounts</h3>
          </div>
          <div className="staff-card-body">
            <div className="staff-stats-value">{total}</div>
            <div className="staff-stats-trend">+12% compared to last week</div>
            <Users className="staff-stats-icon" />
          </div>
        </div>

        <div className="staff-stats-card">
          <div className="staff-card-header">
            <h3 className="staff-card-title">Pending Approval</h3>
          </div>
          <div className="staff-card-body">
            <div className="staff-stats-value">{pendingCount}</div>
            <div className="staff-stats-trend">{pendingCount} new accounts</div>
            <Clock className="staff-stats-icon" />
          </div>
        </div>

        <div className="staff-stats-card">
          <div className="staff-card-header">
            <h3 className="staff-card-title">Approved</h3>
          </div>
          <div className="staff-card-body">
            <div className="staff-stats-value">{approvedCount}</div>
            <div className="staff-stats-trend">
              {approvalRate}% approval rate
            </div>
            <CheckCircle2 className="staff-stats-icon" />
          </div>
        </div>

        <div className="staff-stats-card">
          <div className="staff-card-header">
            <h3 className="staff-card-title">Rejected</h3>
          </div>
          <div className="staff-card-body">
            <div className="staff-stats-value">{rejectedCount}</div>
            <div className="staff-stats-trend">Needs review</div>
            <UserX className="staff-stats-icon" />
          </div>
        </div>
      </div>

      {/* Doughnut Chart */}
      <div
        style={{
          maxWidth: 400,
          margin: "32px auto",
          height: 320,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 8px #eee",
          padding: 24,
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: 16 }}>
          Account Status Overview
        </h3>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
}
