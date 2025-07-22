import { useEffect, useState } from 'react';
import axios from 'axios';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/customers')
      .then(res => setCustomers(res.data))
      .catch(err => {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers');
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Customer List</h3>
      {error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-600">No customers yet.</p>
      ) : (
        <ul className="space-y-2">
          {customers.map(customer => (
            <li
              key={customer._id}
              className="p-3 bg-gray-50 border border-gray-200 rounded-md"
            >
              <span className="font-medium">{customer.name}</span> ({customer.contact}) -{' '}
              {customer.energyNeeds || 'N/A'} kWh/month
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomerList;