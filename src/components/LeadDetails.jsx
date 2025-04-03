import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../constants';
import { useLoading } from '../context/LoadingContext';

function LeadDetails({ onLeadUpdated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    occupation: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leadResponse, notesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/leads/${id}`),
          axios.get(`${API_BASE_URL}/leads/${id}/notes`)
        ]);
        setLead(leadResponse.data);
        setNotes(notesResponse.data);
        setEditForm({
          name: leadResponse.data.name,
          occupation: leadResponse.data.occupation,
          phone: leadResponse.data.phone,
          address: leadResponse.data.address
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load lead details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setLoading]);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await axios.patch(`${API_BASE_URL}/leads/${id}`, {
        status: newStatus
      });
      setLead(prev => ({ ...prev, status: newStatus }));
      onLeadUpdated();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setEditForm({
      name: lead.name,
      occupation: lead.occupation,
      phone: lead.phone,
      address: lead.address
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`${API_BASE_URL}/lead/edit/${id}`, editForm);
      setLead(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      onLeadUpdated();
    } catch (error) {
      console.error('Error updating lead:', error);
      setError('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/leads/${id}/notes`, {
        content: note
      });
      const notesResponse = await axios.get(`${API_BASE_URL}/leads/${id}/notes`);
      setNotes(notesResponse.data);
      setNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/leads/${id}/notes/${noteId}`);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2 className="lead-title">Lead not found</h2>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {error && (
        <div className="error-alert" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <div className="card">
        <div className="lead-header">
          <div>
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="occupation" className="form-label">Occupation</label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={editForm.occupation}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter occupation"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="lead-title">{lead.name}</h2>
                <p className="lead-subtitle">{lead.occupation}</p>
                <div className="lead-info">
                  <p className="lead-info-item">
                    <svg
                      className="info-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {lead.phone}
                  </p>
                  <p className="lead-info-item">
                    <svg
                      className="info-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {lead.address}
                  </p>
                </div>
                <button
                  onClick={handleEdit}
                  className="btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  Edit Details
                </button>
              </>
            )}
          </div>
          <div className="lead-status-buttons">
            <button
              onClick={() => handleStatusChange('hot')}
              className={`lead-status-button status-hot ${lead.status === 'hot' ? 'active' : ''}`}
            >
              Hot
            </button>
            <button
              onClick={() => handleStatusChange('warm')}
              className={`lead-status-button status-warm ${lead.status === 'warm' ? 'active' : ''}`}
            >
              Warm
            </button>
            <button
              onClick={() => handleStatusChange('cold')}
              className={`lead-status-button status-cold ${lead.status === 'cold' ? 'active' : ''}`}
            >
              Cold
            </button>
          </div>
        </div>

        <div className="notes-section">
          <h3 className="notes-title">Notes</h3>
          <form onSubmit={handleAddNote} className="note-form">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a new note..."
              className="form-input"
              rows="3"
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: '0.5rem' }}
              disabled={loading || !note.trim()}
            >
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </form>

          <div className="note-list">
            {notes.map(note => (
              <div key={note.id} className="note-item">
                <p className="note-content">{note.content}</p>
                <div className="note-meta">
                  <span className="note-date">
                    {new Date(note.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="note-delete"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

LeadDetails.propTypes = {
  onLeadUpdated: PropTypes.func.isRequired
};

export default LeadDetails; 