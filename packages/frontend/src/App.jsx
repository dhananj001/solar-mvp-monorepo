import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layout/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import CRM from '@/pages/CRM';
import Quotes from '@/pages/Quotes';
import Subsidies from '@/pages/Subsidies';
import Projects from '@/pages/Projects';
import Inventory from '@/pages/Inventory';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Logout from '@/pages/Logout';
import Settings from '@/pages/Settings';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/subsidies" element={<Subsidies />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;