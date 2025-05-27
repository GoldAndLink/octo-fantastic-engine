"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type React from "react";
import { useState } from "react";

export default function PlanForm() {
  const [formData, setFormData] = useState({
    planName: "",
    pricingModel: "Fixed",
    creditsPerPeriod: "",
    pricePerCredit: "",
    productUsageApi: "AIR Direct",
    contractLength: "Month",
    paymentCadence: "Monthly",
    setupFee: "",
    prepaymentPercentage: "",
    capAmount: "",
    overageCost: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="w-full border border-gray-200 rounded-lg shadow-sm">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="planName"
                className="block text-sm font-medium text-gray-700"
              >
                Plan Name
              </label>
              <Input
                id="planName"
                placeholder="Enter plan name"
                value={formData.planName}
                onChange={(e) => handleInputChange("planName", e.target.value)}
                className="w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="pricingModel"
                className="block text-sm font-medium text-gray-700"
              >
                Pricing Model
              </label>
              <Select
                value={formData.pricingModel}
                onValueChange={(value) =>
                  handleInputChange("pricingModel", value)
                }
              >
                <SelectTrigger
                  id="pricingModel"
                  className="w-full border border-gray-300 rounded-md"
                >
                  <SelectValue placeholder="Select pricing model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Variable">Variable</SelectItem>
                  <SelectItem value="Tiered">Tiered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="creditsPerPeriod"
                className="block text-sm font-medium text-gray-700"
              >
                Credits per Period
              </label>
              <Input
                id="creditsPerPeriod"
                type="number"
                value={formData.creditsPerPeriod}
                onChange={(e) =>
                  handleInputChange("creditsPerPeriod", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="pricePerCredit"
                className="block text-sm font-medium text-gray-700"
              >
                Price per Credit
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="pricePerCredit"
                  type="number"
                  value={formData.pricePerCredit}
                  onChange={(e) =>
                    handleInputChange("pricePerCredit", e.target.value)
                  }
                  className="w-full pl-6 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="productUsageApi"
                className="block text-sm font-medium text-gray-700"
              >
                Product Usage API
              </label>
              <Select
                value={formData.productUsageApi}
                onValueChange={(value) =>
                  handleInputChange("productUsageApi", value)
                }
              >
                <SelectTrigger
                  id="productUsageApi"
                  className="w-full border border-gray-300 rounded-md"
                >
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AIR Direct">AIR Direct</SelectItem>
                  <SelectItem value="Nexus Base">Nexus Base</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contractLength"
                className="block text-sm font-medium text-gray-700"
              >
                Contract Length
              </label>
              <Select
                value={formData.contractLength}
                onValueChange={(value) =>
                  handleInputChange("contractLength", value)
                }
              >
                <SelectTrigger
                  id="contractLength"
                  className="w-full border border-gray-300 rounded-md"
                >
                  <SelectValue placeholder="Select contract length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Month">Month</SelectItem>
                  <SelectItem value="Quarter">Quarter</SelectItem>
                  <SelectItem value="Year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="paymentCadence"
                className="block text-sm font-medium text-gray-700"
              >
                Payment Cadence
              </label>
              <Select
                value={formData.paymentCadence}
                onValueChange={(value) =>
                  handleInputChange("paymentCadence", value)
                }
              >
                <SelectTrigger
                  id="paymentCadence"
                  className="w-full border border-gray-300 rounded-md"
                >
                  <SelectValue placeholder="Select payment cadence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="setupFee"
                className="block text-sm font-medium text-gray-700"
              >
                Setup Fee
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="setupFee"
                  type="number"
                  value={formData.setupFee}
                  onChange={(e) =>
                    handleInputChange("setupFee", e.target.value)
                  }
                  className="w-full pl-6 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="prepaymentPercentage"
                className="block text-sm font-medium text-gray-700"
              >
                Prepayment %
              </label>
              <div className="relative">
                <Input
                  id="prepaymentPercentage"
                  type="number"
                  value={formData.prepaymentPercentage}
                  onChange={(e) =>
                    handleInputChange("prepaymentPercentage", e.target.value)
                  }
                  className="w-full pr-6 border border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="capAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Cap Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="capAmount"
                  type="number"
                  value={formData.capAmount}
                  onChange={(e) =>
                    handleInputChange("capAmount", e.target.value)
                  }
                  className="w-full pl-6 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 max-w-[50%]">
            <label
              htmlFor="overageCost"
              className="block text-sm font-medium text-gray-700"
            >
              Overage Cost
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <Input
                id="overageCost"
                type="number"
                value={formData.overageCost}
                onChange={(e) =>
                  handleInputChange("overageCost", e.target.value)
                }
                className="w-full pl-6 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="outline"
              type="button"
              className="border border-gray-300 rounded-md px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white rounded-md px-6"
            >
              Create Plan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
