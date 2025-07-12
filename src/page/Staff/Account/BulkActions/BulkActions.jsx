import React, { useState } from 'react';
import { CheckCircle2, XCircle, X, Download } from "lucide-react";
import './BulkActions.scss';

export default function BulkActions({ 
  selectedCount, 
  onClearSelection, 
  accounts, 
  selectedAccounts,
  onAccountsUpdate 
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkApproval = async (status) => {
    setIsProcessing(true);
    try {
      const currentUser = await User.me();
      const promises = selectedAccounts.map(accountId =>
        Account.update(accountId, {
          status,
          approved_by: currentUser.email,
          approved_date: new Date().toISOString(),
          approval_notes: `Bulk approval - ${status === 'approved' ? 'Approved' : 'Rejected'}`
        })
      );
      
      await Promise.all(promises);
      onAccountsUpdate();
      onClearSelection();
    } catch (error) {
      console.error("Error processing bulk approval:", error);
    }
    setIsProcessing(false);
  };

  const handleExportSelected = () => {
    const selectedAccountsData = accounts.filter(acc => selectedAccounts.includes(acc.id));
    const csvContent = [
      'Họ tên,Email,Điện thoại,Công ty,Chức vụ,Trạng thái,Ngày tạo',
      ...selectedAccountsData.map(acc => 
        `"${acc.full_name}","${acc.email}","${acc.phone || ''}","${acc.company || ''}","${acc.position || ''}","${acc.status}","${acc.created_date}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'selected_accounts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bulk-actions-card">
      <div className="bulk-actions-content">
        <div className="bulk-actions-container">
          <div className="selection-info">
            <span className="selected-count">{selectedCount} accounts selected</span>
            <button
              type="button"
              onClick={onClearSelection}
              className="clear-selection-button"
            >
              <X className="clear-icon" />
            </button>
          </div>
          <div className="action-buttons">
            <button
              type="button"
              onClick={() => handleBulkApproval('approved')}
              disabled={isProcessing}
              className="approve-button"
            >
              <CheckCircle2 className="approve-icon" />
              Approve all
            </button>
            <button
              type="button"
              onClick={() => handleBulkApproval('rejected')}
              disabled={isProcessing}
              className="reject-button"
            >
              <XCircle className="reject-icon" />
              Reject all
            </button>
            <button
              type="button"
              onClick={handleExportSelected}
              className="export-button"
            >
              <Download className="export-icon" />
              Export data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}