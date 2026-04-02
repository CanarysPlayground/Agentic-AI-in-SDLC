import React, { useState, useEffect } from 'react';
import './IncidentModal.css';

const IncidentModal = ({ incident, mode, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assignee: ''
  });

  useEffect(() => {
    if (incident && mode !== 'create') {
      setFormData({
        title: incident.title,
        description: incident.description,
        status: incident.status,
        priority: incident.priority,
        assignee: incident.assignee
      });
    }
  }, [incident, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {mode === 'create' && 'Create New Incident'}
            {mode === 'edit' && 'Edit Incident'}
            {mode === 'view' && 'Incident Details'}
          </h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isReadOnly}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isReadOnly}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isReadOnly}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority:</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isReadOnly}
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Assignee:</label>
            <input
              type="text"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>

          {incident && mode === 'view' && (
            <div className="incident-metadata">
              <p><strong>Created:</strong> {formatDate(incident.createdAt)}</p>
              <p><strong>Last Updated:</strong> {formatDate(incident.updatedAt)}</p>
              <p><strong>ID:</strong> {incident.id}</p>
            </div>
          )}

          <div className="modal-footer">
            {mode === 'view' && (
              <>
                {onDelete && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          const editButton = document.querySelector(`[data-incident-id="${incident.id}"]`);
                          if (editButton) editButton.click();
                        }, 100);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => onDelete(incident.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
            
            {(mode === 'edit' || mode === 'create') && (
              <>
                <button type="submit" className="btn btn-primary">
                  {mode === 'create' ? 'Create' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              </>
            )}

            {mode === 'view' && (
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentModal;
