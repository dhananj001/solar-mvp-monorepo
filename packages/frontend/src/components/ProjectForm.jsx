import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

function ProjectForm({ project, onSubmit, onCancel }) {
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState('pending');
  const [milestones, setMilestones] = useState('');
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // Populate form when project prop changes (Edit mode)
  useEffect(() => {
    if (project) {
      setCustomerId(project.customerId || '');
      setStatus(project.status || 'pending');
      setMilestones(project.milestones ? project.milestones.join(', ') : '');
    }
  }, [project]);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // const res = await axios.get('/api/customers', {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
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
        milestones: milestones ? milestones.split(',').map((m) => m.trim()) : [],
      };
      if (project?._id) {
        await axios.put(`${API_BASE_URL}/api/projects/${project._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // await axios.put(`/api/projects/${project._id}`, payload, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        setMessage('Project updated successfully.');
      } else {
        await axios.post(`${API_BASE_URL}/api/projects`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // await axios.post('/api/projects', payload, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        setMessage('Project added successfully.');
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
    return <div className="h-48 w-full max-w-md rounded-xl bg-gray-100 animate-pulse" />;
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer */}
          <div className="space-y-2">
            <Label htmlFor="customerId" className="text-gray-700 font-medium">
              Customer
            </Label>
            <Select value={customerId} onValueChange={setCustomerId} required>
              <SelectTrigger className="border-gray-200 focus:ring-2 focus:ring-gray-300 rounded-lg">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-lg">
                {customers.map((customer) => (
                  <SelectItem
                    key={customer._id}
                    value={customer._id}
                    className="text-gray-700 hover:bg-gray-50"
                  >
                    {customer.name} ({customer.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-700 font-medium">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger className="border-gray-200 focus:ring-2 focus:ring-gray-300 rounded-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-lg">
                <SelectItem value="pending" className="text-gray-700 hover:bg-gray-50">
                  Pending
                </SelectItem>
                <SelectItem value="ongoing" className="text-gray-700 hover:bg-gray-50">
                  Ongoing
                </SelectItem>
                <SelectItem value="completed" className="text-gray-700 hover:bg-gray-50">
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <Label htmlFor="milestones" className="text-gray-700 font-medium">
              Milestones (comma-separated)
            </Label>
            <Input
              id="milestones"
              type="text"
              value={milestones}
              onChange={(e) => setMilestones(e.target.value)}
              placeholder="e.g., Site survey, Installation"
              className="border-gray-200 focus:ring-2 focus:ring-gray-300 rounded-lg"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
            >
              {project?._id ? 'Update Project' : 'Add Project'}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Message */}
        {message && (
          <p
            className={cn(
              'text-sm font-medium',
              message.includes('Error') ? 'text-red-500' : 'text-green-600'
            )}
          >
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

ProjectForm.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string,
    customerId: PropTypes.string,
    status: PropTypes.string,
    milestones: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ProjectForm.defaultProps = {
  project: null,
};

export default ProjectForm;
