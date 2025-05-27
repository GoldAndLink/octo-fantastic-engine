"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import Link from "next/link";
import useSWR, { mutate } from "swr";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">
      {children}
    </th>
  );
}
function TableCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-sm text-[#1f2937] ${className}`}>
      {children}
    </td>
  );
}

export default function ClientWorkflows() {
  const {
    data: workflows,
    error,
    isLoading,
  } = useSWR<any[]>("/api/client/workflows", fetcher);

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading workflows</p>;

  async function toggle(id: string, value: boolean) {
    const ok = confirm(
      `Are you sure you want to ${value ? "activate" : "deactivate"}?`
    );
    if (!ok) return;

    await fetch("/api/client/workflow-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowId: id, active: value }),
    });
    mutate("/api/client/workflows");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#1f2937]">Workflows</h2>
        <Link href="/admin/clients/add">
          <Button className="bg-[#000000] hover:bg-[#1f2937]">
            <Plus className="h-4 w-4 mr-2" />
            Add Workflow
          </Button>
        </Link>
      </div>

      <Card className="bg-white rounded-lg border border-[#e5e7eb] overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#faf9f8]">
                <TableHeader>Create Date</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Workflow Name</TableHeader>
                <TableHeader># of Nodes</TableHeader>
                <TableHeader># of Executions</TableHeader>
                <TableHeader># of Exceptions</TableHeader>
                <TableHeader>Time Saved</TableHeader>
                <TableHeader>$ Saved</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader> </TableHeader>
              </tr>
            </thead>
            <tbody>
              {workflows?.map((w) => (
                <tr key={w.id} className="border-b border-[#e5e7eb]">
                  <TableCell>
                    <div>
                      <div>{w.create_date?.split(",")[0]},</div>
                      <div>{w.create_date.split(",")[1]}</div>
                    </div>
                  </TableCell>
                  <TableCell>{w.department}</TableCell>
                  <TableCell>{w.workflow_name}</TableCell>
                  <TableCell>{w.nodes}</TableCell>
                  <TableCell className="text-[#4e86cf]">
                    {w.executions}
                  </TableCell>
                  <TableCell className="text-[#4e86cf]">
                    {w.exceptions}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-end">
                      <span className="mr-1">{w.time_saved}</span>
                      <span className="text-xs text-[#757575]">min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-end">
                      <span className="mr-1">{w.money_saved}</span>
                      <span className="text-xs text-[#757575]">USD</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={w.is_active}
                      onCheckedChange={(v) => toggle(w.id, v)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      className="text-[#4e86cf] hover:underline text-sm"
                    >
                      ROI Report
                    </Link>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
