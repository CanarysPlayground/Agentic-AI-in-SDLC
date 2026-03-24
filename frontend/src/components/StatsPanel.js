import React from 'react';
import './StatsPanel.css';

const StatsPanel = ({ stats }) => {
  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">Total Incidents</div>
      </div>
      
      <div className="stat-card status-open">
        <div className="stat-value">{stats.byStatus.open}</div>
        <div className="stat-label">Open</div>
      </div>
      
      <div className="stat-card status-in-progress">
        <div className="stat-value">{stats.byStatus['in-progress']}</div>
        <div className="stat-label">In Progress</div>
      </div>
      
      <div className="stat-card status-resolved">
        <div className="stat-value">{stats.byStatus.resolved}</div>
        <div className="stat-label">Resolved</div>
      </div>
      
      <div className="stat-card priority-critical">
        <div className="stat-value">{stats.byPriority.critical}</div>
        <div className="stat-label">Critical</div>
      </div>
      
      <div className="stat-card priority-high">
        <div className="stat-value">{stats.byPriority.high}</div>
        <div className="stat-label">High Priority</div>
      </div>
    </div>
  );
};

export default StatsPanel;
