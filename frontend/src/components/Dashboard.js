import React, { useState, useEffect } from 'react';
import { fetchIncidents, updateIncident, deleteIncident, createIncident, fetchStats } from '../utils/api';
import IncidentList from './IncidentList';
import IncidentFilters from './IncidentFilters';
import IncidentModal from './IncidentModal';
import StatsPanel from './StatsPanel';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await fetchIncidents(filters);
      setIncidents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load incidents. Please make sure the backend server is running.');
      console.error('Error loading incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  useEffect(() => {
    loadIncidents();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditIncident = (incident) => {
    setSelectedIncident(incident);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreateIncident = () => {
    setSelectedIncident(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSaveIncident = async (incidentData) => {
    try {
      if (modalMode === 'create') {
        await createIncident(incidentData);
      } else if (modalMode === 'edit') {
        await updateIncident(selectedIncident.id, incidentData);
      }
      await loadIncidents();
      await loadStats();
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to save incident: ' + err.message);
    }
  };

  const handleDeleteIncident = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await deleteIncident(id);
        await loadIncidents();
        await loadStats();
        setIsModalOpen(false);
      } catch (err) {
        alert('Failed to delete incident: ' + err.message);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIncident(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Incident Management Dashboard</h1>
        <div className="dashboard-header-actions">
          {user && (
            <span className="dashboard-user">Welcome, <strong>{user.username}</strong></span>
          )}
          <button className="btn btn-primary" onClick={handleCreateIncident}>
            Create New Incident
          </button>
          {onLogout && (
            <button className="btn btn-secondary" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      {stats && <StatsPanel stats={stats} />}

      <div className="dashboard-content">
        <IncidentFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading incidents...</div>
        ) : (
          <IncidentList
            incidents={incidents}
            onIncidentClick={handleIncidentClick}
            onEditIncident={handleEditIncident}
          />
        )}
      </div>

      {isModalOpen && (
        <IncidentModal
          incident={selectedIncident}
          mode={modalMode}
          onClose={handleCloseModal}
          onSave={handleSaveIncident}
          onDelete={handleDeleteIncident}
        />
      )}
    </div>
  );
};

export default Dashboard;
