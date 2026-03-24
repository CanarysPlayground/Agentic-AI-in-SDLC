import React from 'react';
import './IncidentFilters.css';

const IncidentFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      status: '',
      priority: '',
      assignee: ''
    });
  };

  return (
    <div className="incident-filters">
      <h3>Filters</h3>
      <div className="filter-group">
        <label>
          Status:
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </label>

        <label>
          Priority:
          <select name="priority" value={filters.priority} onChange={handleChange}>
            <option value="">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label>
          Assignee:
          <input
            type="text"
            name="assignee"
            value={filters.assignee}
            onChange={handleChange}
            placeholder="Search by assignee..."
          />
        </label>

        <button className="btn btn-secondary" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default IncidentFilters;
