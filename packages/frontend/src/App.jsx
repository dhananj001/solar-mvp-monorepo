import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground p-4 shadow-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-center">Solar Business Dashboard</h1>
            <nav className="mt-2 flex justify-center space-x-4">
              <Link to="/" className="text-primary-foreground hover:underline">Home</Link>
              <Link to="/customers" className="text-primary-foreground hover:underline">Customers</Link>
            </nav>
          </div>
        </header>
        <main className="p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<CustomerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  const [message, setMessage] = useState('Loading...');
  useEffect(() => {
    axios.get('/api/test')
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage('Error connecting to backend'));
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

function CustomerPage() {
  return (
    <div className="space-y-6">
      <CustomerForm onAdd={() => window.dispatchEvent(new Event('refreshCustomers'))} />
      <CustomerList />
    </div>
  );
}

export default App;