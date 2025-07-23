import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Zap,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomerForm({ customer, onSubmit, onCancel }) {
  const [name, setName] = useState(customer?.name ?? "");
  const [contact, setContact] = useState(customer?.contact ?? "");
  const [energyNeeds, setEnergyNeeds] = useState(customer?.energyNeeds ?? "");
  const [type, setType] = useState(customer?.type ?? "residential");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name,
        contact,
        energyNeeds: Number(energyNeeds) || 0,
        type,
      };

      if (customer?._id) {
        await axios.put(`/api/customers/${customer._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMsg("Updated successfully");
      } else {
        await axios.post("/api/customers", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMsg("Created successfully");
      }

      setTimeout(() => {
        setName("");
        setContact("");
        setEnergyNeeds("");
        setType("residential");
        onSubmit();
      }, 1200);
    } catch {
      setMsg("Error saving customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" /> Full Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Uday Kumar"
              required
            />
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Contact
            </Label>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="eg. 9898989898"
              required
            />
          </div>

          {/* Energy Needs */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Energy Needs (kWh/month)
            </Label>
            <Input
              type="number"
              min="0"
              value={energyNeeds}
              onChange={(e) => setEnergyNeeds(e.target.value)}
              placeholder="450"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Type
            </Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex gap-2 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving…" : customer?._id ? "Update" : "Create"}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>

          {msg && (
            <div
              className={cn(
                "md:col-span-2 flex items-center gap-2 rounded-md p-3 text-sm font-medium",
                msg.includes("success")
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              )}
            >
              {msg.includes("success") ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {msg}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
