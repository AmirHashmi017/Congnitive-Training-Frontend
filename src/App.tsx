import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GameContainer from './components/GameContainer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="w-full h-screen overflow-hidden">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/play"
              element={
                <PrivateRoute>
                  <GameContainer />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
