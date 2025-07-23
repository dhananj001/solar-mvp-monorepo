import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function QuoteForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    customerId: '',
    systemSize: '',
    cost: '',
    subsidyApplied: '',
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prefill data in edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customerId || '',
        systemSize: initialData.systemSize || '',
        cost: initialData.cost || '',
        subsidyApplied: initialData.subsidyApplied || '',
      });
    }
  }, [initialData]);

  // Fetch customer list for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/customers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(res.data);
      } catch (err) {
        console.error('Failed to fetch customers', err);
        setError('Failed to load customers');
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (initialData && initialData._id) {
        // Update existing quote
        await axios.put(`/api/quotes/${initialData._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new quote
        await axios.post('/api/quotes', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({
        customerId: '',
        systemSize: '',
        cost: '',
        subsidyApplied: '',
      });

      if (onSubmit) onSubmit();
    } catch (err) {
      console.error('Failed to save quote', err);
      setError('Failed to save the quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Customer Dropdown */}
      <div>
        <Label htmlFor="customerId">Customer</Label>
        <select
          id="customerId"
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          className="mt-1 block w-full rounded border border-gray-300 p-2"
          required
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* System Size */}
      <div>
        <Label htmlFor="systemSize">System Size (kW)</Label>
        <Input
          type="number"
          id="systemSize"
          name="systemSize"
          value={formData.systemSize}
          onChange={handleChange}
          placeholder="e.g., 5"
          required
        />
      </div>

      {/* Cost */}
      <div>
        <Label htmlFor="cost">Cost (₹)</Label>
        <Input
          type="number"
          id="cost"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          placeholder="e.g., 50000"
          required
        />
      </div>

      {/* Subsidy */}
      <div>
        <Label htmlFor="subsidyApplied">Subsidy (₹)</Label>
        <Input
          type="number"
          id="subsidyApplied"
          name="subsidyApplied"
          value={formData.subsidyApplied}
          onChange={handleChange}
          placeholder="e.g., 10000"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? 'Saving...' : initialData ? 'Update Quote' : 'Create Quote'}
      </Button>
    </form>
  );
}

export default QuoteForm;
