import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">Solar Business MVP</h1>
          <nav className="mt-2 flex justify-center space-x-4">
            <Link to="/" className="text-white hover:underline">Home</Link>
            <Link to="/customers" className="text-white hover:underline">Customers</Link>
          </nav>
        </header>
        <main className="p-6">
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
      .catch(() => setMessage('Error connecting to backend'));
  }, []);
  return <p className="text-center text-gray-700">{message}</p>;
}

function CustomerPage() {
  return (
    <div className="space-y-6">
      <CustomerForm />
      <CustomerList />
    </div>
  );
}

export default App;