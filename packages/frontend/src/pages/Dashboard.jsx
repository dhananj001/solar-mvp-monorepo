import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card as TremorCard, Text, Metric, AreaChart } from '@tremor/react';
import { Users, Calendar, Box, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Helper function to show relative time like '3 days ago'
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;
  return 'Just now';
}

const iconBgColors = {
  'Total Customers': '#3B82F6',      // blue-500
  'Active Projects': '#10B981',      // emerald-500
  'Inventory Value': '#8B5CF6',      // violet-500
  'Subsidies Applied': '#F59E0B',    // amber-500
};

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
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
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

  // Sample monthly data, replace with your actual data if available
  const chartData = [
    { month: 'Jan', Residential: 300, Commercial: 200 },
    { month: 'Feb', Residential: 280, Commercial: 220 },
    { month: 'Mar', Residential: 340, Commercial: 260 },
    { month: 'Apr', Residential: 320, Commercial: 210 },
    { month: 'May', Residential: 350, Commercial: 230 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiData.map(({ name, value, icon: Icon }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <TremorCard className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 cursor-default">
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center justify-center rounded-full w-12 h-12 text-white"
                  style={{ backgroundColor: iconBgColors[name] }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Text className="text-gray-500 dark:text-gray-400 font-semibold text-sm mb-1">
                    {name}
                  </Text>
                  <Metric className="text-gray-900 dark:text-gray-100 text-2xl font-bold">
                    {value}
                  </Metric>
                </div>
              </div>
            </TremorCard>
          </motion.div>
        ))}
      </div>

      {/* Monthly Energy Needs Chart */}
      <Card className="shadow-lg rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Energy Needs</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart
            data={chartData}
            index="month"
            categories={['Residential', 'Commercial']}
            colors={['blue', 'emerald']}
            valueFormatter={(value) => `${value} kWh`}
            className="h-64"
            curveType="monotone"
          />
        </CardContent>
      </Card>

      {/* Recent Customers Table */}
      <Card className="shadow-lg rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCustomers.slice(0, 5).map((customer) => (
                <motion.tr
                  key={customer._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-muted/50 transition"
                >
                  <TableCell className="flex items-center gap-2 font-medium">
                    <Avatar>
                      <AvatarFallback>{customer.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {customer.name}
                  </TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.type}</TableCell>
                  <TableCell>{timeAgo(customer.createdAt)}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
