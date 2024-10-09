import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { DollarSign } from 'lucide-react';
import AggregatedRevenueTable from './components/AggregatedRevenueTable';
import AccountView from './components/AccountView';
import PMView from './components/PMView';
import DLView from './components/DLView';
import BDView from './components/BDView';
import BusinessTypeView from './components/BusinessTypeView';
import DataEntryPanel from './components/DataEntryPanel';
import Login from './components/Login';
import Register from './components/Register';
import { useRevenueData } from './hooks/useRevenueData';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function AppContent() {
  const { entries, addEntry, updateEntry, deleteEntry } = useRevenueData();
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-500 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
            </div>
            <nav>
              <ul className="flex space-x-4">
                {user ? (
                  <>
                    <li>
                      <Link to="/" className="text-gray-600 hover:text-gray-900">Overview</Link>
                    </li>
                    <li>
                      <Link to="/accounts" className="text-gray-600 hover:text-gray-900">Accounts</Link>
                    </li>
                    <li>
                      <Link to="/pm" className="text-gray-600 hover:text-gray-900">PM</Link>
                    </li>
                    <li>
                      <Link to="/dl" className="text-gray-600 hover:text-gray-900">DL</Link>
                    </li>
                    <li>
                      <Link to="/bd" className="text-gray-600 hover:text-gray-900">BD</Link>
                    </li>
                    <li>
                      <Link to="/business-type" className="text-gray-600 hover:text-gray-900">Business Type</Link>
                    </li>
                    <li>
                      <Link to="/data-entry" className="text-gray-600 hover:text-gray-900">Data Entry</Link>
                    </li>
                    <li>
                      <button onClick={logout} className="text-gray-600 hover:text-gray-900">Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-gray-600 hover:text-gray-900">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <div className="bg-white shadow rounded-lg p-6 overflow-hidden">
                  <AggregatedRevenueTable entries={entries} onUpdateEntry={updateEntry} onDeleteEntry={deleteEntry} />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/accounts" element={
              <ProtectedRoute>
                <AccountView entries={entries} />
              </ProtectedRoute>
            } />
            <Route path="/pm" element={
              <ProtectedRoute>
                <PMView entries={entries} />
              </ProtectedRoute>
            } />
            <Route path="/dl" element={
              <ProtectedRoute>
                <DLView entries={entries} />
              </ProtectedRoute>
            } />
            <Route path="/bd" element={
              <ProtectedRoute>
                <BDView entries={entries} />
              </ProtectedRoute>
            } />
            <Route path="/business-type" element={
              <ProtectedRoute>
                <BusinessTypeView entries={entries} />
              </ProtectedRoute>
            } />
            <Route path="/data-entry" element={
              <ProtectedRoute>
                <DataEntryPanel entries={entries} onAddEntry={addEntry} onUpdateEntry={updateEntry} onDeleteEntry={deleteEntry} />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;