import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function SubsidyForm({ subsidy, onSubmit, onCancel }) {
  const [name, setName] = useState(subsidy?.name || '');
  const [eligibilityCriteria, setEligibilityCriteria] = useState(subsidy?.eligibilityCriteria || '');
  const [amount, setAmount] = useState(subsidy?.amount || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, eligibilityCriteria, amount: Number(amount) || 0 };
      const token = localStorage.getItem('token');
      if (subsidy) {
        await axios.put(`/api/subsidies/${subsidy._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Subsidy updated');
      } else {
        await axios.post('/api/subsidies', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Subsidy added');
      }
      setName('');
      setEligibilityCriteria('');
      setAmount('');
      onSubmit();
    } catch (err) {
      setMessage('Error saving subsidy');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{subsidy ? 'Edit Subsidy' : 'Add Subsidy'}</CardTitle>
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
              placeholder="e.g., PM Surya Ghar"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
            <Input
              id="eligibilityCriteria"
              type="text"
              value={eligibilityCriteria}
              onChange={(e) => setEligibilityCriteria(e.target.value)}
              required
              placeholder="e.g., Residential, energyNeeds > 500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="w-full">{subsidy ? 'Update' : 'Add'} Subsidy</Button>
            {subsidy && (
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

export default SubsidyForm;