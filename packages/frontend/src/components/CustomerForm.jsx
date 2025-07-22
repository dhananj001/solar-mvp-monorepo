import { useState } from 'react';
import axios from 'axios';

function CustomerForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [energyNeeds, setEnergyNeeds] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/customers', { name, contact, energyNeeds: Number(energyNeeds) });
      setMessage(`Added customer: ${res.data.name}`);
      setName(''); setContact(''); setEnergyNeeds('');
    } catch (err) {
      setMessage('Error adding customer');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Customer</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Energy Needs (kWh/month)</label>
          <input
            type="number"
            value={energyNeeds}
            onChange={(e) => setEnergyNeeds(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Customer
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default CustomerForm;