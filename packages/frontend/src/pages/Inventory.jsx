import { useEffect, useState, useMemo } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BarChart, Card as TremorCard, Text } from "@tremor/react";

import { Plus, Search, Edit3, Trash2, Package, Layers } from "lucide-react";
import InventoryForm from "@/components/InventoryForm";
import { cn } from "@/lib/utils";

// Small stats card
const StatCard = ({ icon: Icon, label, value }) => (
  <Card className="bg-white border border-gray-100 rounded-lg">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {label}
      </CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
    </CardContent>
  </Card>
);

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState([]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
      setFilteredItems(res.data);

      // Chart data
      const chartData = res.data.map((item) => ({
        name: item.itemName,
        "Stock Level": item.stockLevel,
        "Low Stock": item.stockLevel < item.threshold ? item.stockLevel : 0,
      }));
      setChartData(chartData);

      setError("");
    } catch (err) {
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        (search.toLowerCase() === "low" && item.stockLevel < item.threshold)
    );
    setFilteredItems(filtered);
  }, [search, items]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      setError("Error deleting item");
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = items.length;
    const lowStock = items.filter((i) => i.stockLevel < i.threshold).length;
    return { total, lowStock };
  }, [items]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your stock and track low inventory items.
          </p>
        </div>
        <Button onClick={() => setEditingItem({})}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Package} label="Total Items" value={stats.total} />
        <StatCard icon={Layers} label="Low Stock" value={stats.lowStock} />
        <StatCard
          icon={Package}
          label="Available Stock"
          value={stats.total - stats.lowStock}
        />
      </div>

      {/* Modal */}
      <Dialog
        open={!!editingItem}
        onOpenChange={(o) => !o && setEditingItem(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem?._id ? "Edit Item" : "Add Item"}
            </DialogTitle>
          </DialogHeader>
          <InventoryForm
            item={editingItem}
            onSubmit={() => {
              setEditingItem(null);
              fetchItems();
            }}
            onCancel={() => setEditingItem(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Stock List</CardTitle>
            <CardDescription>
              Showing {filteredItems.length} of {items.length} items
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by item or 'low'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No items found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">
                      {item.itemName}
                    </TableCell>
                    <TableCell>{item.stockLevel}</TableCell>
                    <TableCell>{item.threshold}</TableCell>
                    <TableCell>
                      {item.stockLevel < item.threshold ? (
                        <Badge className="bg-red-100 text-red-700">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          In Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                        className="hover:bg-gray-100"
                      >
                        <Edit3 className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete item?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove{" "}
                              <strong>{item.itemName}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Stock Levels Chart */}
      <TremorCard className="border-none bg-white rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
  <div className="flex items-center justify-between">
    <Text className="text-lg font-semibold text-gray-800">
      Stock Overview
    </Text>
  </div>

  <div className="w-full">
    {/* Inner wrapper to constrain chart width but keep full width container */}
    <div
      className="mx-auto"
      style={{ maxWidth: chartData.length === 1 ? 300 : "100%" }}
    >
      <BarChart
        data={chartData}
        index="name"
        categories={["Stock Level", "Low Stock"]}
        colors={["slate", "rose"]}
        valueFormatter={(value) => `${value} units`}
        className="h-64 mt-6"
        yAxisWidth={60}
        customTooltip={({ payload }) => {
          if (!payload?.length) return null;
          const { name, value } = payload[0].data;
          return (
            <div className="p-3 rounded-lg bg-white shadow border border-gray-100">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs text-gray-500">
                Stock Level: {value} units
              </p>
            </div>
          );
        }}
      />
    </div>
  </div>
</TremorCard>

    </div>
  );
}
