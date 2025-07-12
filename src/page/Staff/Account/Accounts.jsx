import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  User,
} from "lucide-react";
import "./Accounts.scss";
import BulkActions from "./BulkActions/BulkActions";
// import { getPendingCertificates, getUserById } from '../../../apiHandler/adminAPIHandler';

const statusConfig = {
  pending: { label: "Pending", className: "ap-status-pending" },
  approved: { label: "Approved", className: "ap-status-approved" },
  suspended: { label: "Suspended", className: "ap-status-suspended" },
};

export default function Accounts() {
  // Dữ liệu fix cứng
  const fixedAccounts = [
    {
      id: 1,
      full_name: "Nguyen Van A",
      email: "a@example.com",
      phone: "0123456789",
      company: "DNA Co.",
      department: "IT",
      status: "pending",
      access_level: "Admin",
      created_date: "01/06/2024",
      position: "Manager",
    },
    {
      id: 2,
      full_name: "Tran Thi B",
      email: "b@example.com",
      phone: "0987654321",
      company: "DNA Co.",
      department: "HR",
      status: "approved",
      access_level: "User",
      created_date: "02/06/2024",
      position: "Staff",
    },
    {
      id: 3,
      full_name: "Le Van C",
      email: "c@example.com",
      phone: "0111222333",
      company: "DNA Co.",
      department: "Finance",
      status: "suspended",
      access_level: "User",
      created_date: "03/06/2024",
      position: "Accountant",
    },
  ];

  const [accounts, setAccounts] = useState(fixedAccounts);
  const [filteredAccounts, setFilteredAccounts] = useState(fixedAccounts);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    filterAccounts();
    // eslint-disable-next-line
  }, [accounts, searchTerm, statusFilter]);

  const filterAccounts = () => {
    let filtered = [...accounts];

    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((account) => account.status === statusFilter);
    }

    setFilteredAccounts(filtered);
  };

  const handleAccountSelect = (accountId) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    setSelectedAccounts(
      selectedAccounts.length === filteredAccounts.length
        ? []
        : filteredAccounts.map((acc) => acc.id)
    );
  };

  return (
    <div className="ap-container">
      <div className="ap-header-actions">
        <div className="ap-search-section">
          <div className="ap-search-wrapper">
            <Search className="ap-search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ap-search-input"
            />
          </div>
          <select
            className="ap-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div className="ap-action-buttons">
          <button className="ap-export-button">
            <Download className="ap-button-icon" />
            Export Excel
          </button>
          <button className="ap-add-button">
            <Plus className="ap-button-icon" />
            Add Account
          </button>
        </div>
      </div>

      {selectedAccounts.length > 0 && (
        <BulkActions
          selectedCount={selectedAccounts.length}
          onClearSelection={() => setSelectedAccounts([])}
          accounts={filteredAccounts}
          selectedAccounts={selectedAccounts}
          onAccountsUpdate={() => {
            // Sau khi cập nhật, làm mới danh sách account (ở đây chỉ mock lại, thực tế sẽ gọi API)
            setAccounts([...accounts]);
            filterAccounts();
          }}
        />
      )}

      <div className="ap-table-card">
        <div className="ap-table-header">
          <div className="ap-table-title">
            Account List ({filteredAccounts.length})
          </div>
          <div className="ap-table-selection">
            {selectedAccounts.length > 0 &&
              `${selectedAccounts.length} selected`}
          </div>
        </div>
        <div className="ap-table-wrapper">
          <table className="ap-table">
            <thead>
              <tr className="ap-table-row-header">
                <th className="ap-table-header-cell">
                  <input
                    type="checkbox"
                    checked={
                      selectedAccounts.length === filteredAccounts.length &&
                      filteredAccounts.length > 0
                    }
                    onChange={handleSelectAll}
                    className="ap-checkbox"
                  />
                </th>
                <th className="ap-table-header-cell">Account</th>
                <th className="ap-table-header-cell">Contact</th>
                <th className="ap-table-header-cell">Status</th>
                <th className="ap-table-header-cell"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={8} className="ap-table-loading">
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
                : filteredAccounts.map((account) => (
                    <tr key={account.id} className="ap-table-row">
                      <td
                        className="ap-table-cell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAccounts.includes(account.id)}
                          onChange={() => handleAccountSelect(account.id)}
                          className="ap-checkbox"
                        />
                      </td>
                      <td className="ap-table-cell">
                        <div className="ap-account-cell">
                          <div
                            className="ap-avatar-icon"
                            style={{
                              backgroundColor:
                                account.full_name[0] === "N"
                                  ? "#6B46C1"
                                  : "#9F7AEA",
                            }}
                          >
                            {account.full_name[0]}
                          </div>
                          <div>
                            <p className="ap-account-name">
                              {account.full_name}
                            </p>
                            <p className="ap-account-position">
                              {account.position || ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="ap-table-cell">
                        <div className="ap-contact-cell">
                          <div className="ap-contact-item">
                            <Mail className="ap-contact-icon" />
                            <span className="ap-contact-text">
                              {account.email}
                            </span>
                          </div>
                          <div className="ap-contact-item">
                            <Phone className="ap-contact-icon" />
                            <span className="ap-contact-text">
                              {account.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="ap-table-cell">
                        <span
                          className={statusConfig[account.status]?.className}
                        >
                          {statusConfig[account.status]?.label}
                        </span>
                      </td>
                      <td
                        className="ap-table-cell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="ap-actions-cell">
                          <button className="ap-action-button">
                            <MoreHorizontal className="ap-action-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
