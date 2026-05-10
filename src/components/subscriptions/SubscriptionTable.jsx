import React from 'react';
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const SubscriptionTable = ({ data = [], onView, onEdit, onDelete }) => {
  return (
    <div className="sub-table-container">
      <table className="sub-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>CIN / Phone</th>
            <th>Operator / Type</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="client-cell">
                  <div className="client-avatar">{row.client.avatar}</div>
                  <div>
                    <div className="client-info-main">{row.client.name}</div>
                    <div className="client-info-sub">{row.client.address}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="client-info-main">{row.contact.cin}</div>
                <div className="client-info-sub">{row.contact.phone}</div>
              </td>
              <td>
                <div className="operator-pill">
                  <span className="dot" style={{ backgroundColor: row.operator.color }}></span>
                  <span className="operator-name">{row.operator.name}</span>
                </div>
                <div className="type-label">{row.operator.type}</div>
              </td>
              <td>
                <span className={`status-badge status-${row.status.toLowerCase()}`}>
                  {row.status}
                </span>
                <div className="client-info-sub" style={{ marginTop: '0.25rem' }}>{row.validator}</div>
              </td>
              <td>
                <div className="client-info-main">{row.date}</div>
              </td>
              <td>
                <div className="flex gap-1">
                  <button 
                    className="action-icon-btn" 
                    title="View Details"
                    onClick={() => onView(row)}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="action-icon-btn" 
                    title="Edit"
                    onClick={() => onEdit(row)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="action-icon-btn text-red-500 hover:bg-red-50" 
                    title="Delete"
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
        <div className="pagination-info">Showing {data.length} entries</div>
        <div className="pagination-buttons">
          <button className="page-btn"><ChevronLeft size={16} /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;
