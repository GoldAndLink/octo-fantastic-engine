"use client";

import ClientsTable from "@/components/dashboard/clients-table";
import DataCards from "@/components/dashboard/data-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import { useState } from "react";

type TimeFilter = "7d" | "30d" | "mtd" | "qtd" | "ytd" | "itd";

export default function AdminDashboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("itd");

  return (
    <>
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <Tabs
            value={timeFilter}
            onValueChange={(value) => setTimeFilter(value as TimeFilter)}
          >
            <ToggleGroup
              type="single"
              className="gap-x-4"
              value={timeFilter}
              onValueChange={(value) => setTimeFilter(value as TimeFilter)}
            >
              <ToggleGroupItem value="7d" className="border-2">
                Last 7 days
              </ToggleGroupItem>
              <ToggleGroupItem value="30d" className="border-2">
                Last 30 days
              </ToggleGroupItem>
              <ToggleGroupItem value="mtd" className="border-2">
                MTD
              </ToggleGroupItem>
              <ToggleGroupItem value="qtd" className="border-2">
                QTD
              </ToggleGroupItem>
              <ToggleGroupItem value="ytd" className="border-2">
                YTD
              </ToggleGroupItem>
              <ToggleGroupItem value="itd" className="border-2">
                ITD
              </ToggleGroupItem>
            </ToggleGroup>
          </Tabs>
        </div>

        <DataCards timeFilter={timeFilter} />

        <Card className="mt-8 p-0">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#e5e7eb]">
              <h2 className="text-lg font-medium">All Clients</h2>
              <Button asChild className="bg-[#141417] hover:bg-[#1f2937]">
                <Link href="/admin/clients/add">
                  <span className="mr-1">+</span> Add Client
                </Link>
              </Button>
            </div>
            <ClientsTable />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
