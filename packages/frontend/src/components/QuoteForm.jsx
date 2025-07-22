import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

function QuoteForm({ onSubmit }) {
  const [customerId, setCustomerId] = useState('');
  const [energyNeeds, setEnergyNeeds] = useState('');
  const [systemSize, setSystemSize] = useState('');
  const [cost, setCost] = useState('');
  const [subsidyApplied, setSubsidyApplied] = useState('');
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/customers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(res.data);
      } catch (err) {
        setMessage('Error loading customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        customerId,
        systemSize: Number(systemSize) || 0,
        cost: Number(cost) || 0,
        subsidyApplied: Number(subsidyApplied) || 0,
      };
      await axios.post('/api/quotes', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Quote generated');
      setCustomerId('');
      setEnergyNeeds('');
      setSystemSize('');
      setCost('');
      setSubsidyApplied('');
      onSubmit();
    } catch (err) {
      setMessage('Error generating quote');
    }
  };

  // Auto-calculate system size and cost based on energy needs
  useEffect(() => {
    if (energyNeeds) {
      const needs = Number(energyNeeds);
      // Simple calculation: 1 kWh/month ≈ 0.01 kW system size, ₹10000/kW cost
      const calculatedSize = needs * 0.01;
      setSystemSize(calculatedSize.toFixed(2));
      setCost((calculatedSize * 10000).toFixed(2));
    } else {
      setSystemSize('');
      setCost('');
    }
  }, [energyNeeds]);

  if (loading) {
    return <Skeleton className="h-48 w-full max-w-md" />;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Generate Quote</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer</Label>
            <Select value={customerId} onValueChange={setCustomerId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer._id} value={customer._id}>
                    {customer.name} ({customer.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="energyNeeds">Energy Needs (kWh/month)</Label>
            <Input
              id="energyNeeds"
              type="number"
              value={energyNeeds}
              onChange={(e) => setEnergyNeeds(e.target.value)}
              placeholder="Enter energy needs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemSize">System Size (kW)</Label>
            <Input
              id="systemSize"
              type="number"
              value={systemSize}
              onChange={(e) => setSystemSize(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost (₹)</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subsidyApplied">Subsidy Applied (₹)</Label>
            <Input
              id="subsidyApplied"
              type="number"
              value={subsidyApplied}
              onChange={(e) => setSubsidyApplied(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Generate Quote</Button>
        </form>
        {message && (
          <p className={cn('mt-4 text-sm', message.includes('Error') ? 'text-destructive' : 'text-green-600')}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default QuoteForm;