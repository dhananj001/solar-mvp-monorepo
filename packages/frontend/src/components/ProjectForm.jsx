import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

function ProjectForm({ project, onSubmit, onCancel }) {
  const [customerId, setCustomerId] = useState(project?.customerId || '');
  const [status, setStatus] = useState(project?.status || 'pending');
  const [milestones, setMilestones] = useState(project?.milestones?.join(', ') || '');
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
        status,
        milestones: milestones ? milestones.split(',').map(m => m.trim()) : [],
      };
      if (project) {
        await axios.put(`/api/projects/${project._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Project updated');
      } else {
        await axios.post('/api/projects', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Project added');
      }
      setCustomerId('');
      setStatus('pending');
      setMilestones('');
      onSubmit();
    } catch (err) {
      setMessage('Error saving project');
    }
  };

  if (loading) {
    return <Skeleton className="h-48 w-full max-w-md" />;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{project ? 'Edit Project' : 'Add Project'}</CardTitle>
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
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="milestones">Milestones (comma-separated)</Label>
            <Input
              id="milestones"
              type="text"
              value={milestones}
              onChange={(e) => setMilestones(e.target.value)}
              placeholder="e.g., Site survey, Installation"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="w-full">{project ? 'Update' : 'Add'} Project</Button>
            {project && (
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

export default ProjectForm;