import React from 'react';
import './IncidentList.css';

const IncidentList = ({ incidents, onIncidentClick, onEditIncident }) => {
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (incidents.length === 0) {
    return <div className="no-incidents">No incidents found.</div>;
  }

  return (
    <div className="incident-list">
      <table className="incident-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id} onClick={() => onIncidentClick(incident)}>
              <td className="incident-title">{incident.title}</td>
              <td>
                <span className={`status-badge ${getStatusClass(incident.status)}`}>
                  {incident.status}
                </span>
              </td>
              <td>
                <span className={`priority-badge ${getPriorityClass(incident.priority)}`}>
                  {incident.priority}
                </span>
              </td>
              <td>{incident.assignee}</td>
              <td className="incident-date">{formatDate(incident.createdAt)}</td>
              <td className="incident-actions">
                <button
                  className="btn btn-sm btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditIncident(incident);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentList;
