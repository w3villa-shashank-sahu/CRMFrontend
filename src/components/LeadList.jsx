import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import { useLoading } from '../context/LoadingContext';

function LeadList({ leads, onLeadUpdated }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [localLeads, setLocalLeads] = useState(leads);
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  const handleStatusChange = async (leadId, newStatus) => {
    setLoading(true);
    try {
      await axios.patch(`${API_BASE_URL}/leads/${leadId}`, {
        status: newStatus
      });
      
      setLocalLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      
      setActiveDropdown(null);
      onLeadUpdated();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusGroups = {
    hot: localLeads.filter(lead => lead.status === 'hot'),
    warm: localLeads.filter(lead => lead.status === 'warm'),
    cold: localLeads.filter(lead => lead.status === 'cold')
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {Object.entries(statusGroups).map(([status, leads]) => (
        <div key={status} className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`status-badge status-${status}`}>
                {status}
              </span>
              <span>Leads</span>
            </h2>
            <span style={{ color: 'var(--text-secondary)' }}>
              {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
            </span>
          </div>
          <div className="lead-grid">
            {leads.map(lead => (
              <div key={lead.id} className="lead-card">
                <div className="lead-header">
                  <Link to={`/lead/${lead.id}`} className="lead-link">
                    <h3 className="lead-name">{lead.name}</h3>
                    <p className="lead-occupation">{lead.occupation}</p>
                  </Link>
                  <div className="status-dropdown">
                    <button 
                      className={`status-dropdown-trigger status-${lead.status}`}
                      onClick={() => setActiveDropdown(activeDropdown === lead.id ? null : lead.id)}
                    >
                      {lead.status}
                      <svg className="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {activeDropdown === lead.id && (
                      <div className="status-dropdown-menu">
                        <button 
                          className={`status-option ${lead.status === 'hot' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(lead.id, 'hot')}
                        >
                          Hot
                        </button>
                        <button 
                          className={`status-option ${lead.status === 'warm' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(lead.id, 'warm')}
                        >
                          Warm
                        </button>
                        <button 
                          className={`status-option ${lead.status === 'cold' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(lead.id, 'cold')}
                        >
                          Cold
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <svg
                      style={{ width: '1rem', height: '1rem' }}
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
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    <svg
                      style={{ width: '1rem', height: '1rem' }}
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

LeadList.propTypes = {
  leads: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      occupation: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  ).isRequired,
  onLeadUpdated: PropTypes.func.isRequired
};

export default LeadList; 