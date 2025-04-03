import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './constants';
import './App.css';

// Components
import Navbar from './components/Navbar';
import LeadList from './components/LeadList';
import AddLead from './components/AddLead';
import LeadDetails from './components/LeadDetails';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leads`);
      setLeads(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <LeadList 
                  leads={leads} 
                  loading={loading} 
                  onLeadUpdated={fetchLeads} 
                />
              } 
            />
            <Route path="/add" element={<AddLead onLeadAdded={fetchLeads} />} />
            <Route path="/lead/:id" element={<LeadDetails onLeadUpdated={fetchLeads} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
