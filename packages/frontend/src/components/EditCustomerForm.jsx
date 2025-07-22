import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

function EditCustomerForm({ customer, onUpdate }) {
  const [name, setName] = useState(customer.name);
  const [contact, setContact] = useState(customer.contact);
  const [energyNeeds, setEnergyNeeds] = useState(customer.energyNeeds || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/customers/${customer._id}`, {
        name,
        contact,
        energyNeeds: Number(energyNeeds) || undefined,
      });
      setMessage(`Updated customer: ${res.data.name}`);
      onUpdate();
    } catch (err) {
      setMessage('Error updating customer');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Edit Customer</CardTitle>
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
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Update Customer</Button>
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

export default EditCustomerForm;