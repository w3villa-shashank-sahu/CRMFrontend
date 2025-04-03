import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './constants';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import './App.css';
import Loader from './components/Loader';

// Components
import Navbar from './components/Navbar';
import LeadList from './components/LeadList';
import AddLead from './components/AddLead';
import LeadDetails from './components/LeadDetails';

function AppContent() {
  const [leads, setLeads] = useState([]);
  const { setLoading } = useLoading();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/leads`);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="app">
      <Loader />
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <LeadList 
                leads={leads} 
                onLeadUpdated={fetchLeads} 
              />
            } 
          />
          <Route path="/add" element={<AddLead onLeadAdded={fetchLeads} />} />
          <Route path="/lead/:id" element={<LeadDetails onLeadUpdated={fetchLeads} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </Router>
  );
}

export default App;
