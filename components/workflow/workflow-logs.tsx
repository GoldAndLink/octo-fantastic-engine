"use client";

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
import { LogEntry, Workflow } from "@/lib/types";

import { useState } from "react";

const logData: Record<string, LogEntry[]> = {
  "1": [
    {
      id: "1",
      timestamp: "2025-05-14 02:15:47",
      workflowId: "1",
      details: "Successfully processed invoice #INV-2025-001",
    },
    {
      id: "2",
      timestamp: "2025-05-14 02:14:32",
      workflowId: "1",
      details: "Data extraction completed for invoice #INV-2025-002",
    },
    {
      id: "3",
      timestamp: "2025-05-14 02:13:15",
      workflowId: "1",
      details: "Started processing invoice batch #BATCH-051",
    },
    {
      id: "4",
      timestamp: "2025-05-14 02:12:03",
      workflowId: "1",
      details: "Validation checks passed for invoice #INV-2025-003",
    },
    {
      id: "5",
      timestamp: "2025-05-14 02:10:47",
      workflowId: "1",
      details: "New invoice detected in input folder",
    },
  ],
  "2": [
    {
      id: "6",
      timestamp: "2025-05-14 01:45:22",
      workflowId: "2",
      details: "Customer onboarding completed for #CUS-2025-042",
    },
    {
      id: "7",
      timestamp: "2025-05-14 01:30:15",
      workflowId: "2",
      details: "Verification email sent to customer@example.com",
    },
  ],
  "3": [
    {
      id: "8",
      timestamp: "2025-05-14 00:15:00",
      workflowId: "3",
      details: "Data synchronization completed successfully",
    },
  ],
  "4": [
    {
      id: "9",
      timestamp: "2025-05-13 23:45:12",
      workflowId: "4",
      details: "Approval request sent to manager",
    },
  ],
};

interface WorkflowLogsProps {
  workflows: Workflow[];
}

export default function WorkflowLogs({ workflows }: WorkflowLogsProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0].id);
  const logs = logData[selectedWorkflow] || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#141417]">
          Workflow Execution Logs
        </h2>
        <div className="w-[250px]">
          <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
            <SelectTrigger className="bg-white">
              <SelectValue>
                {workflows.find((w) => w.id === selectedWorkflow)?.name ||
                  "Select workflow"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {workflows.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-[#e5e7eb] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] text-[#1f2937] pl-5 py-4">
                Timestamp
              </TableHead>
              <TableHead className="text-[#1f2937]">Workflow</TableHead>
              <TableHead className="text-[#1f2937]">
                Execution Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-[#1f2937]">
                  {log.timestamp}
                </TableCell>
                <TableCell className="text-[#1f2937]">
                  {workflows.find((w) => w.id === log.workflowId)?.name}
                </TableCell>
                <TableCell className="text-[#1f2937]">{log.details}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-[#1f2937]"
                >
                  No logs found for this workflow
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
