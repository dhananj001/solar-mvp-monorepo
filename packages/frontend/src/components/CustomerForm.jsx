import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function CustomerForm({ customer, onSubmit, onCancel }) {
  const [name, setName] = useState(customer?.name || '');
  const [contact, setContact] = useState(customer?.contact || '');
  const [energyNeeds, setEnergyNeeds] = useState(customer?.energyNeeds || '');
  const [type, setType] = useState(customer?.type || 'residential');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, contact, energyNeeds: Number(energyNeeds) || 0, type };
      const token = localStorage.getItem('token');
      if (customer) {
        await axios.put(`/api/customers/${customer._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Customer updated');
      } else {
        await axios.post('/api/customers', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Customer added');
      }
      setName('');
      setContact('');
      setEnergyNeeds('');
      setType('residential');
      onSubmit();
    } catch (err) {
      setMessage('Error saving customer');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{customer ? 'Edit Customer' : 'Add Customer'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="energyNeeds">Energy Needs (kWh/month)</Label>
            <Input
              id="energyNeeds"
              type="number"
              value={energyNeeds}
              onChange={(e) => setEnergyNeeds(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="w-full">{customer ? 'Update' : 'Add'} Customer</Button>
            {customer && (
              <Button type="button" variant="outline" onClick={onCancel} className="w-full">
                Cancel
              </Button>
            )}
          </div>
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

export default CustomerForm;