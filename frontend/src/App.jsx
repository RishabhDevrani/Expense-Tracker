import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </div>
      <Toast />
    </div>
  );
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
