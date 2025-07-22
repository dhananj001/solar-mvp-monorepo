import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/layout/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import CRM from '@/pages/CRM';
import Quotes from '@/pages/Quotes';
import Subsidies from '@/pages/Subsidies';
import Projects from '@/pages/Projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/subsidies" element={<Subsidies />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

function Inventory() {
  return <div>Inventory Page (to be implemented)</div>;
}

function Settings() {
  return <div>Settings Page (to be implemented)</div>;
}

function Logout() {
  return <div>Logout Page (to be implemented)</div>;
}

export default App;