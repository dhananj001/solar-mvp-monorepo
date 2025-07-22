import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/layout/DashboardLayout';
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
          <Route path="/" element={<Dashboard />} /> {/* Redirect to dashboard */}
        </Route>
      </Routes>
    </Router>
  );
}

function Dashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Welcome to the Solar Business Dashboard</p>
      </CardContent>
    </Card>
  );
}

function CRM() {
  return <div>CRM Page (to be implemented)</div>;
}

function Quotes() {
  return <div>Quotes Page (to be implemented)</div>;
}

function Subsidies() {
  return <div>Subsidies Page (to be implemented)</div>;
}

function Projects() {
  return <div>Projects Page (to be implemented)</div>;
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