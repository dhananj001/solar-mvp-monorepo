import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card as TremorCard, Text, Metric, BarChart } from '@tremor/react';
import { Users, Calendar, Box, DollarSign } from 'lucide-react';

function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const insightsRes = await axios.get('/api/dashboard/insights');
        setInsights(insightsRes.data);

        const customersRes = await axios.get('/api/customers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { limit: 5, sort: '-createdAt' },
        });
        setRecentCustomers(customersRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  const kpiData = [
    { name: 'Total Customers', value: insights.totalCustomers, icon: Users },
    { name: 'Active Projects', value: insights.activeProjects, icon: Calendar },
    { name: 'Inventory Value', value: `₹${insights.totalStockValue}`, icon: Box },
    { name: 'Subsidies Applied', value: `₹${insights.totalSubsidiesApplied}`, icon: DollarSign },
  ];

  const chartData = [
    { name: 'Residential', 'Energy Needs': insights.residentialCount * insights.avgEnergyNeeds },
    { name: 'Commercial', 'Energy Needs': insights.commercialCount * insights.avgEnergyNeeds },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map(({ name, value, icon: Icon }) => (
          <TremorCard key={name}>
            <Text>{name}</Text>
            <Metric>{value}</Metric>
            <Icon className="h-6 w-6 mt-2 text-muted-foreground" />
          </TremorCard>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Energy Needs by Customer Type</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={chartData}
            index="name"
            categories={['Energy Needs']}
            colors={['blue']}
            valueFormatter={(value) => `${value.toFixed(0)} kWh`}
            className="h-64"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Energy Needs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCustomers.map(customer => (
                <TableRow key={customer._id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.type}</TableCell>
                  <TableCell>{customer.energyNeeds || 'N/A'} kWh/month</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;