import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function InventoryForm({ item, onSubmit, onCancel }) {
  const [itemName, setItemName] = useState(item?.itemName || '');
  const [stockLevel, setStockLevel] = useState(item?.stockLevel || '');
  const [threshold, setThreshold] = useState(item?.threshold || '');
  const [message, setMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // Sync form values when `item` changes (for editing)
  useEffect(() => {
    if (item) {
      setItemName(item.itemName || '');
      setStockLevel(item.stockLevel || '');
      setThreshold(item.threshold || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        itemName: itemName.trim(),
        stockLevel: Number(stockLevel),
        threshold: Number(threshold),
      };

      if (!payload.itemName || payload.stockLevel < 0 || payload.threshold < 0) {
        setMessage('Please fill all fields correctly');
        return;
      }

      if (item?._id) {
        await axios.put(`${API_BASE_URL}/api/inventory/${item._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // await axios.put(`/api/inventory/${item._id}`, payload, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        setMessage('Item updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/api/inventory`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Item added successfully');
      }
      //   await axios.post('/api/inventory', payload, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      //   setMessage('Item added successfully');
      // }

      // Reset form
      setItemName('');
      setStockLevel('');
      setThreshold('');

      // Callback
      onSubmit();
    } catch (err) {
      setMessage('Error saving item');
    }
  };

  return (
    <Card className="border border-gray-100 bg-white shadow-none">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="itemName" className="text-gray-700 font-medium">
              Item Name
            </Label>
            <Input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Solar Panel"
              className="border-gray-200 focus:ring-2 focus:ring-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Stock Level */}
          <div className="space-y-2">
            <Label htmlFor="stockLevel" className="text-gray-700 font-medium">
              Stock Level
            </Label>
            <Input
              id="stockLevel"
              type="number"
              value={stockLevel}
              onChange={(e) => setStockLevel(e.target.value)}
              placeholder="e.g., 100"
              className="border-gray-200 focus:ring-2 focus:ring-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Threshold */}
          <div className="space-y-2">
            <Label htmlFor="threshold" className="text-gray-700 font-medium">
              Threshold (Low Stock Alert)
            </Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="e.g., 20"
              className="border-gray-200 focus:ring-2 focus:ring-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
            >
              {item?._id ? 'Update' : 'Add'} Item
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="w-full border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>

        {message && (
          <p
            className={cn(
              'mt-4 text-sm',
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

InventoryForm.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    itemName: PropTypes.string,
    stockLevel: PropTypes.number,
    threshold: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

InventoryForm.defaultProps = {
  item: null,
};

export default InventoryForm;
