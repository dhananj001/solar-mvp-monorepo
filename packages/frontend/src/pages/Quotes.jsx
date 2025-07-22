import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card as TremorCard, Text, Metric } from '@tremor/react';
import QuoteForm from '@/components/QuoteForm';
import { cn } from '@/lib/utils';

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ totalQuotes: 0, avgCost: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [quotesRes, customersRes] = await Promise.all([
        axios.get('/api/quotes', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/customers', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setQuotes(quotesRes.data);
      setCustomers(customersRes.data);
      setStats({
        totalQuotes: quotesRes.data.length,
        avgCost: quotesRes.data.length ? (quotesRes.data.reduce((sum, q) => sum + q.cost, 0) / quotesRes.data.length).toFixed(2) : 0,
      });
      setError('');
    } catch (err) {
      setError('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full max-w-md" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <TremorCard className="max-w-md">
        <Text>Quote Stats</Text>
        <Metric>{stats.totalQuotes} Quotes</Metric>
        <Text>Average Cost: ₹{stats.avgCost}</Text>
      </TremorCard>

      {/* Quote Form */}
      <QuoteForm onSubmit={fetchData} />

      {/* Quote History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quote History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>System Size (kW)</TableHead>
                <TableHead>Cost (₹)</TableHead>
                <TableHead>Subsidy (₹)</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => {
                const customer = customers.find((c) => c._id === quote.customerId);
                return (
                  <TableRow key={quote._id}>
                    <TableCell className="font-medium">{customer ? customer.name : 'Unknown'}</TableCell>
                    <TableCell>{quote.systemSize}</TableCell>
                    <TableCell>₹{quote.cost}</TableCell>
                    <TableCell>₹{quote.subsidyApplied || 0}</TableCell>
                    <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Quotes;