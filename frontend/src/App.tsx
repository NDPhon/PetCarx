import { useState } from 'react';
import './App.css';
import AppointmentForm from './components/appointments/AppointmentForm';
import AppointmentList from './components/appointments/AppointmentList';
import AppointmentSearch from './components/appointments/AppointmentSearch';

function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'search'>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAppointmentCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab('list');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>PetCare Appointment Management</h1>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          View Appointments
        </button>
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Create Appointment
        </button>
        <button
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => setActiveTab('search')}
        >
          Search by Phone
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'list' && <AppointmentList refreshTrigger={refreshTrigger} />}
        {activeTab === 'create' && <AppointmentForm onSuccess={handleAppointmentCreated} />}
        {activeTab === 'search' && <AppointmentSearch />}
      </main>
    </div>
  );
}

export default App;
