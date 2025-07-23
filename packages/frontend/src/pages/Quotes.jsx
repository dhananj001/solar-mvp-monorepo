import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card as TremorCard, Text, Metric } from '@tremor/react';
import QuoteForm from '@/components/QuoteForm';

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ totalQuotes: 0, avgCost: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null); // For edit mode

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [quotesRes, customersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/quotes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/customers`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setQuotes(quotesRes.data);
      setCustomers(customersRes.data);
      setStats({
        totalQuotes: quotesRes.data.length,
        avgCost: quotesRes.data.length
          ? (quotesRes.data.reduce((sum, q) => sum + q.cost, 0) / quotesRes.data.length).toFixed(2)
          : 0,
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

  const handlePdfRedirect = () => {
    window.location.href = 'https://grouptuljai.in/pdf';
  };

  const handleEstimateFormRedirect = () => {
    window.location.href = 'https://grouptuljai.in/estimateform';
  };

  const handleEdit = (quote) => {
    setSelectedQuote(quote); // Set the quote for editing
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/quotes/${quoteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete the quote');
    }
  };

  const handleFormSubmit = async () => {
    setSelectedQuote(null); // Reset after submit
    fetchData();
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quote History - Left (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-gray-50 dark:bg-gray-900 rounded-t-lg">
            <CardTitle className="text-lg font-semibold">Quote History</CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>System Size (kW)</TableHead>
                  <TableHead>Cost (₹)</TableHead>
                  <TableHead>Subsidy (₹)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
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
                      <TableCell className="flex gap-2 justify-center">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleEdit(quote)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(quote._id)}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Buttons below Quote History */}
        <div className="flex flex-wrap gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={handlePdfRedirect}
          >
            Generate PDF
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
            onClick={handleEstimateFormRedirect}
          >
            Estimate Form
          </button>
        </div>
      </div>

      {/* Generate Quote + Stats - Right */}
      <div className="space-y-6">
        {/* Stats Card */}
        {/* <TremorCard className="shadow-sm border border-gray-200">
          <Text className="text-sm font-medium">Quote Stats</Text>
          <Metric className="text-xl font-bold">{stats.totalQuotes} Quotes</Metric>
          <Text className="text-sm text-gray-500">Average Cost: ₹{stats.avgCost}</Text>
        </TremorCard> */}

        {/* Quote Form (Create / Edit) */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-gray-50 dark:bg-gray-900 rounded-t-lg">
            <CardTitle className="text-lg font-semibold">
              {selectedQuote ? 'Edit Quote' : 'Generate Quote'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteForm
              onSubmit={handleFormSubmit}
              initialData={selectedQuote} // Pass data for editing
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Quotes;