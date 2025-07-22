import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function InventoryForm({ item, onSubmit, onCancel }) {
  const [itemName, setItemName] = useState(item?.itemName || '');
  const [stockLevel, setStockLevel] = useState(item?.stockLevel || '');
  const [threshold, setThreshold] = useState(item?.threshold || '10');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        itemName,
        stockLevel: Number(stockLevel) || 0,
        threshold: Number(threshold) || 10,
      };
      const token = localStorage.getItem('token');
      if (item) {
        await axios.put(`/api/inventory/${item._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Item updated');
      } else {
        await axios.post('/api/inventory', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Item added');
      }
      setItemName('');
      setStockLevel('');
      setThreshold('10');
      onSubmit();
    } catch (err) {
      setMessage('Error saving item');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{item ? 'Edit Item' : 'Add Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              placeholder="e.g., Solar Panel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockLevel">Stock Level</Label>
            <Input
              id="stockLevel"
              type="number"
              value={stockLevel}
              onChange={(e) => setStockLevel(e.target.value)}
              required
              placeholder="e.g., 20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="threshold">Low Stock Threshold</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="w-full">{item ? 'Update' : 'Add'} Item</Button>
            {item && (
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

export default InventoryForm;