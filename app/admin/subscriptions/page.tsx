"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  pricingModel: "Tiered" | "Fixed" | "Usage";
  contractLength: string;
  billingCadence: "Monthly" | "Quarterly" | "Annually";
  setupFee: number;
  prepaymentPercent: number;
  cap: number;
  overageCost: number;
  clientCount: number;
}

export default function PlanManager() {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Enterprise Pro",
      pricingModel: "Tiered",
      contractLength: "12 months",
      billingCadence: "Monthly",
      setupFee: 5000,
      prepaymentPercent: 25,
      cap: 100000,
      overageCost: 150,
      clientCount: 12,
    },
    {
      id: "2",
      name: "Business Plus",
      pricingModel: "Fixed",
      contractLength: "6 months",
      billingCadence: "Quarterly",
      setupFee: 2500,
      prepaymentPercent: 15,
      cap: 50000,
      overageCost: 125,
      clientCount: 28,
    },
    {
      id: "3",
      name: "Starter",
      pricingModel: "Usage",
      contractLength: "3 months",
      billingCadence: "Monthly",
      setupFee: 1000,
      prepaymentPercent: 10,
      cap: 25000,
      overageCost: 100,
      clientCount: 45,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (id: string, field: string) => {
    setEditingId(id);
    setEditingField(field);
  };

  const handleSave = (id: string, field: string, value: any) => {
    setPlans(
      plans.map((plan) => (plan.id === id ? { ...plan, [field]: value } : plan))
    );
    setEditingId(null);
    setEditingField(null);
  };

  const handleAddPlan = () => {
    const newPlan: Plan = {
      id: Date.now().toString(),
      name: "New Plan",
      pricingModel: "Fixed",
      contractLength: "12 months",
      billingCadence: "Monthly",
      setupFee: 0,
      prepaymentPercent: 0,
      cap: 0,
      overageCost: 0,
      clientCount: 0,
    };
    setPlans([...plans, newPlan]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderEditableCell = (plan: Plan, field: keyof Plan, value: any) => {
    const isEditing = editingId === plan.id && editingField === field;

    if (isEditing) {
      if (field === "pricingModel") {
        return (
          <Select
            defaultValue={value}
            onValueChange={(newValue) => handleSave(plan.id, field, newValue)}
            onOpenChange={(open) => !open && setEditingId(null)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tiered">Tiered</SelectItem>
              <SelectItem value="Fixed">Fixed</SelectItem>
              <SelectItem value="Usage">Usage</SelectItem>
            </SelectContent>
          </Select>
        );
      } else if (field === "billingCadence") {
        return (
          <Select
            defaultValue={value}
            onValueChange={(newValue) => handleSave(plan.id, field, newValue)}
            onOpenChange={(open) => !open && setEditingId(null)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
              <SelectItem value="Annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        );
      } else {
        return (
          <Input
            type={typeof value === "number" ? "number" : "text"}
            defaultValue={value}
            className="w-[120px]"
            onBlur={(e) => {
              const newValue =
                typeof value === "number"
                  ? Number.parseFloat(e.target.value) || 0
                  : e.target.value;
              handleSave(plan.id, field, newValue);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const newValue =
                  typeof value === "number"
                    ? Number.parseFloat(e.currentTarget.value) || 0
                    : e.currentTarget.value;
                handleSave(plan.id, field, newValue);
              }
            }}
            autoFocus
          />
        );
      }
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
        onClick={() => handleEdit(plan.id, field)}
      >
        {field === "setupFee" || field === "cap"
          ? formatCurrency(value as number)
          : field === "overageCost"
          ? `${formatCurrency(value as number)}/hr`
          : field === "prepaymentPercent"
          ? `${value}%`
          : value}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f8]">
      <div className="flex">
        <div className="flex-1">
          <div className="p-8">
            <div className="bg-[#faf9f8] rounded-lg">
              <div className="flex justify-between pb-4 ">
                <h1 className="text-2xl font-bold">Plan Manager</h1>
                <Button
                  onClick={handleAddPlan}
                  className="bg-[#1f2937] hover:bg-[#1f2937]/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Plan
                </Button>
              </div>
              <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-[#faf9f8]">
                      <TableHead className="pl-4 pr-4 py-3 font-medium text-[#1f2937]">
                        Name
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium text-[#1f2937]">
                        Pricing Model
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium text-[#1f2937]">
                        Contract Length
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium text-[#1f2937]">
                        Billing Cadence
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium text-[#1f2937]">
                        Setup Fee
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium text-[#1f2937]">
                        Prepayment %
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium text-[#1f2937]">
                        $ Cap
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium text-[#1f2937]">
                        Overage Cost
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium text-[#1f2937]">
                        # Clients
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white">
                    {plans.map((plan) => (
                      <TableRow key={plan.id} className="hover:bg-[#faf9f8]">
                        <TableCell>
                          {renderEditableCell(plan, "name", plan.name)}
                        </TableCell>
                        <TableCell>
                          {renderEditableCell(
                            plan,
                            "pricingModel",
                            plan.pricingModel
                          )}
                        </TableCell>
                        <TableCell>
                          {renderEditableCell(
                            plan,
                            "contractLength",
                            plan.contractLength
                          )}
                        </TableCell>
                        <TableCell>
                          {renderEditableCell(
                            plan,
                            "billingCadence",
                            plan.billingCadence
                          )}
                        </TableCell>
                        <TableCell>
                          {renderEditableCell(plan, "setupFee", plan.setupFee)}
                        </TableCell>
                        <TableCell>
                          {renderEditableCell(
                            plan,
                            "prepaymentPercent",
                            plan.prepaymentPercent
                          )}
                        </TableCell>
                        <TableCell>
                          {renderEditableCell(plan, "cap", plan.cap)}
                        </TableCell>
                        <TableCell>
                          {renderEditableCell(
                            plan,
                            "overageCost",
                            plan.overageCost
                          )}
                        </TableCell>
                        <TableCell>
                          {renderEditableCell(
                            plan,
                            "clientCount",
                            plan.clientCount
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
