import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RevenueDashboard.scss";

const RevenueDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    endDate: new Date(), // Today
  });
  // Dữ liệu fix cứng cho dashboardData
  const fixedDashboardData = {
    totalRevenue: 120000000,
    totalTransactions: 320,
    averageTransactionValue: 375000,
    monthlyRevenue: 25000000,
    revenueOverTime: [
      { date: "2024-06-01", amount: 2000000 },
      { date: "2024-06-02", amount: 2500000 },
      { date: "2024-06-03", amount: 3000000 },
      { date: "2024-06-04", amount: 3500000 },
      { date: "2024-06-05", amount: 4000000 },
      { date: "2024-06-06", amount: 4500000 },
      { date: "2024-06-07", amount: 5000000 },
      { date: "2024-06-08", amount: 5500000 },
      { date: "2024-06-09", amount: 6000000 },
      { date: "2024-06-10", amount: 6500000 },
    ],
    revenueByCategory: [
      { category: "Subscription", percent: 45 },
      { category: "Consultation", percent: 30 },
      { category: "Service Fee", percent: 20 },
      { category: "Other", percent: 5 },
    ],
    recentTransactions: [
      {
        customer: "Nguyen Van A",
        date: "2024-06-10",
        amount: 2000000,
        category: "Subscription",
        source: "Bank",
      },
      {
        customer: "Tran Thi B",
        date: "2024-06-09",
        amount: 1500000,
        category: "Consultation",
        source: "Cash",
      },
      {
        customer: "Le Van C",
        date: "2024-06-08",
        amount: 3000000,
        category: "Service Fee",
        source: "Bank",
      },
      {
        customer: "Pham Thi D",
        date: "2024-06-07",
        amount: 2500000,
        category: "Subscription",
        source: "Bank",
      },
      {
        customer: "Hoang Van E",
        date: "2024-06-06",
        amount: 1000000,
        category: "Other",
        source: "Cash",
      },
      {
        customer: "Nguyen Van F",
        date: "2024-06-05",
        amount: 3500000,
        category: "Consultation",
        source: "Bank",
      },
      {
        customer: "Tran Thi G",
        date: "2024-06-04",
        amount: 4000000,
        category: "Subscription",
        source: "Bank",
      },
      {
        customer: "Le Van H",
        date: "2024-06-03",
        amount: 4500000,
        category: "Service Fee",
        source: "Cash",
      },
      {
        customer: "Pham Thi I",
        date: "2024-06-02",
        amount: 5000000,
        category: "Consultation",
        source: "Bank",
      },
      {
        customer: "Hoang Van K",
        date: "2024-06-01",
        amount: 5500000,
        category: "Subscription",
        source: "Bank",
      },
    ],
  };
  const [dashboardData, setDashboardData] = useState(fixedDashboardData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const transactionsPerPage = 10; // Number of transactions per page

  // Không fetch API nữa, chỉ dùng dữ liệu fix cứng
  useEffect(() => {
    setDashboardData(fixedDashboardData);
    setLoading(false);
  }, [customDateRange.startDate, customDateRange.endDate]);

  // Calculate statistics based on API data
  const statistics = useMemo(() => {
    if (!dashboardData)
      return {
        totalRevenue: 0,
        totalTransactions: 0,
        avgTransactionValue: 0,
        pieChartData: [],
        lineChartData: [],
      };

    const {
      totalRevenue,
      totalTransactions,
      averageTransactionValue,
      revenueOverTime,
      revenueByCategory,
    } = dashboardData;

    // Process pie chart data
    const pieChartData = revenueByCategory.map((item, index) => ({
      name: item.category,
      value: item.percent,
      color:
        item.category === "Subscription"
          ? "#8B5CF6"
          : item.category === "Consultation"
          ? "#06B6D4"
          : item.category === "Service Fee"
          ? "#EC4899"
          : "#F59E0B",
    }));

    // Process line chart data
    const lineChartData = revenueOverTime.map((item) => {
      const date = new Date(item.date);
      const dateKey = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
      return {
        date: dateKey,
        value: Math.abs(item.amount), // Display full amount in VND
      };
    });

    return {
      totalRevenue: Math.abs(totalRevenue), // Make positive for display
      totalTransactions,
      avgTransactionValue: Math.abs(averageTransactionValue), // Make positive for display
      pieChartData,
      lineChartData,
    };
  }, [dashboardData]);

  // Pagination logic for transactions
  const totalPages = Math.ceil(
    (dashboardData?.recentTransactions?.length || 0) / transactionsPerPage
  );
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions =
    dashboardData?.recentTransactions?.slice(
      indexOfFirstTransaction,
      indexOfLastTransaction
    ) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const StatCard = ({ title, value, trend, trendText, color, icon: Icon }) => (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className={`stat-icon ${color}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div
        className={`stat-trend ${
          trend === "up"
            ? "positive"
            : trend === "down"
            ? "negative"
            : "neutral"
        }`}
      >
        {trend === "up" && <TrendingUp size={16} />}
        {trend === "down" && <TrendingDown size={16} />}
        <span>{trendText}</span>
      </div>
    </div>
  );

  const CategoryBadge = ({ category }) => {
    const getColor = (cat) => {
      switch (cat) {
        case "Subscription":
          return "badge-purple";
        case "Consultation":
          return "badge-blue";
        case "Service Fee":
          return "badge-pink";
        default:
          return "badge-gray";
      }
    };

    return (
      <span className={`category-badge ${getColor(category)}`}>{category}</span>
    );
  };

  // Handle date range change
  const handleDateRangeChange = (field, date) => {
    setCustomDateRange((prev) => ({ ...prev, [field]: date }));
    setCurrentPage(1); // Reset to first page when date range changes
  };

  // Reset date filter
  const handleResetFilter = () => {
    const defaultStartDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const defaultEndDate = new Date();
    setCustomDateRange({
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    });
    setCurrentPage(1); // Reset to first page
    // setDashboardData(fixedDashboardData); // No need to refetch fixed data
  };

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => setDashboardData(fixedDashboardData)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Revenue Dashboard</h1>
          <p>Analyze and track cash flow</p>
        </div>
        <div className="header-controls">
          <div className="date-filter-container">
            <div className="date-range-picker">
              <DatePicker
                selected={customDateRange.startDate}
                onChange={(date) => handleDateRangeChange("startDate", date)}
                selectsStart
                startDate={customDateRange.startDate}
                endDate={customDateRange.endDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="From date"
                className="date-input"
                maxDate={customDateRange.endDate}
              />
              <span style={{ margin: "0 4px" }}>-</span>
              <DatePicker
                selected={customDateRange.endDate}
                onChange={(date) => handleDateRangeChange("endDate", date)}
                selectsEnd
                startDate={customDateRange.startDate}
                endDate={customDateRange.endDate}
                minDate={customDateRange.startDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="To date"
                className="date-input"
              />
              {(customDateRange.startDate || customDateRange.endDate) && (
                <button
                  onClick={handleResetFilter}
                  className="reset-filter-btn"
                  style={{
                    marginLeft: "8px",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(statistics.totalRevenue)}
          trend="up"
          trendText="Growth over time"
          color="green"
          icon={DollarSign}
        />
        <StatCard
          title="Revenue this month"
          value={formatCurrency(dashboardData?.monthlyRevenue || 0)}
          trend="neutral"
          trendText="0.0% compared to last month"
          color="blue"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Transactions"
          value={statistics.totalTransactions.toString()}
          trend="up"
          trendText="Number of transactions"
          color="purple"
          icon={Users}
        />
        <StatCard
          title="Average Transaction Value"
          value={formatCurrency(statistics.avgTransactionValue)}
          trend="up"
          trendText="Value of each transaction"
          color="orange"
          icon={DollarSign}
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Revenue over time (VND)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statistics.lineChartData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 3, r: 5, stroke: "white" }}
                activeDot={{
                  r: 8,
                  stroke: "#3b82f6",
                  strokeWidth: 3,
                  fill: "white",
                }}
                fill="url(#lineGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Revenue distribution by category</h3>
          <div className="pie-chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <defs>
                  <linearGradient id="pieGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="pieGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0891B2" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="pieGradient3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity={1} />
                    <stop offset="100%" stopColor="#DB2777" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="pieGradient4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                    <stop offset="100%" stopColor="#D97706" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Pie
                  data={statistics.pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statistics.pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Subscription"
                          ? "url(#pieGradient1)"
                          : entry.name === "Consultation"
                          ? "url(#pieGradient2)"
                          : entry.name === "Service Fee"
                          ? "url(#pieGradient3)"
                          : "url(#pieGradient4)"
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {statistics.pieChartData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div
                    className="legend-color"
                    style={{
                      background:
                        item.name === "Subscription"
                          ? "linear-gradient(135deg, #8B5CF6, #7C3AED)"
                          : item.name === "Consultation"
                          ? "linear-gradient(135deg, #06B6D4, #0891B2)"
                          : item.name === "Service Fee"
                          ? "linear-gradient(135deg, #EC4899, #DB2777)"
                          : "linear-gradient(135deg, #F59E0B, #D97706)",
                    }}
                  ></div>
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <h3>Recent Transactions</h3>
        <div className="transactions-table">
          <div className="table-header">
            <div>Customer</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Category</div>
            <div>Source</div>
          </div>
          {currentTransactions.map((transaction, index) => (
            <div key={index} className="table-row">
              <div className="customer-name">{transaction.customer}</div>
              <div className="transaction-date">
                {formatDate(transaction.date)}
              </div>
              <div className="transaction-amount">
                {formatCurrency(Math.abs(transaction.amount))}
              </div>
              <div className="transaction-category">
                <CategoryBadge category={transaction.category} />
              </div>
              <div className="payment-method">{transaction.source}</div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {dashboardData?.recentTransactions &&
          dashboardData.recentTransactions.length > transactionsPerPage && (
            <div className="pagination-container">
              <div className="pagination-info">
                <span>
                  Displaying {indexOfFirstTransaction + 1}-
                  {Math.min(
                    indexOfLastTransaction,
                    dashboardData.recentTransactions.length
                  )}{" "}
                  of {dashboardData.recentTransactions.length} transactions
                </span>
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-button prev"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`page-number ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="pagination-button next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default RevenueDashboard;
