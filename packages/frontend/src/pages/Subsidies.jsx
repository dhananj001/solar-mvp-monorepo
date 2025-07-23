import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Card as TremorCard, Text } from '@tremor/react';
import SubsidyForm from '@/components/SubsidyForm';
import { cn } from '@/lib/utils';

function Subsidies() {
  const [subsidies, setSubsidies] = useState([]);
  const [filteredSubsidies, setFilteredSubsidies] = useState([]);
  const [search, setSearch] = useState('');
  const [editingSubsidy, setEditingSubsidy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchSubsidies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/subsidies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubsidies(res.data);
      setFilteredSubsidies(res.data);

      // Aggregate subsidies by month for chart
      const monthlyData = res.data.reduce((acc, subsidy) => {
        const date = new Date(subsidy.createdAt);
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + subsidy.amount;
        return acc;
      }, {});
      const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
        Month: month,
        'Subsidy Amount': amount,
      }));
      setChartData(chartData);

      setError('');
    } catch (err) {
      setError('Failed to load subsidies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubsidies();
  }, []);

  useEffect(() => {
    const filtered = subsidies.filter(
      (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.eligibilityCriteria.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSubsidies(filtered);
  }, [search, subsidies]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/subsidies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubsidies();
    } catch (err) {
      setError('Error deleting subsidy');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full max-w-md" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Subsidy Form */}
      <SubsidyForm
        subsidy={editingSubsidy}
        onSubmit={() => {
          setEditingSubsidy(null);
          fetchSubsidies();
        }}
        onCancel={() => setEditingSubsidy(null)}
      />

      {/* Subsidies Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Subsidies</CardTitle>
            <Input
              type="text"
              placeholder="Search by name or eligibility..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Eligibility Criteria</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubsidies.map((subsidy) => (
                <TableRow key={subsidy._id}>
                  <TableCell className="font-medium">{subsidy.name}</TableCell>
                  <TableCell>{subsidy.eligibilityCriteria}</TableCell>
                  <TableCell>₹{subsidy.amount}</TableCell>
                  <TableCell>{new Date(subsidy.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSubsidy(subsidy)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {subsidy.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(subsidy._id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subsidy Savings Chart */}
      <TremorCard>
        <Text>Subsidy Savings Over Time</Text>
        <LineChart
          data={chartData}
          index="Month"
          categories={['Subsidy Amount']}
          colors={['blue']}
          valueFormatter={(value) => `₹${value}`}
          className="h-64"
        />
      </TremorCard>
    </div>
  );
}

export default Subsidies;