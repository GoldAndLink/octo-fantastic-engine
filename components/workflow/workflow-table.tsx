"use client";

import { Switch } from "@/components/ui/switch";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SortField =
  | "date"
  | "department"
  | "name"
  | "nodes"
  | "executions"
  | "exceptions"
  | "timeSaved"
  | "costSaved"
  | "status";
type SortDirection = "asc" | "desc";

interface WorkflowData {
  date: string;
  time: string;
  department: string;
  name: string;
  nameLink: string;
  description: string;
  nodes: number;
  executions: number;
  exceptions: number;
  timeSaved: string;
  costSaved: string;
  status: boolean;
}

const workflowData: WorkflowData[] = [
  {
    date: "2025-05-14",
    time: "09:30",
    department: "Finance",
    name: "Invoice Processing",
    nameLink: "#invoice-processing",
    description: "Automated invoice processing workflow",
    nodes: 12,
    executions: 1234,
    exceptions: 23,
    timeSaved: "156.5",
    costSaved: "15650",
    status: true,
  },
  {
    date: "2025-05-13",
    time: "14:15",
    department: "HR",
    name: "Employee Onboarding",
    nameLink: "#employee-onboarding",
    description: "New employee onboarding automation",
    nodes: 8,
    executions: 456,
    exceptions: 5,
    timeSaved: "89.2",
    costSaved: "8920",
    status: true,
  },
];

export default function WorkflowTable() {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [statusMap, setStatusMap] = useState(
    workflowData.reduce(
      (acc, w, i) => ({ ...acc, [i]: w.status }),
      {} as Record<number, boolean>
    )
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...workflowData].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === "date") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
      return sortDirection === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="border border-[#e5e7eb] rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#faf9f8] border-b border-[#e5e7eb]">
            <SortableTableHead
              title="Create Date/Time"
              field="date"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              title="Department"
              field="department"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              title="Workflow Name"
              field="name"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
            <th className="px-4 py-3 text-left font-medium">Description</th>
            <SortableTableHead
              title="Nodes"
              field="nodes"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              title="Executions"
              field="executions"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              title="Exceptions"
              field="exceptions"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              title="Time Saved"
              field="timeSaved"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              title="Cost Saved"
              field="costSaved"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((workflow, index) => (
            <tr
              key={index}
              className="border-b border-[#e5e7eb] bg-white hover:bg-[#faf9f8]"
            >
              <td className="px-4 py-3">
                <div>{workflow.date}</div>
                <div>{workflow.time}</div>
              </td>
              <td className="px-4 py-3">{workflow.department}</td>
              <td className="px-4 py-3">
                <Link
                  href={workflow.nameLink}
                  className="text-[#4e86cf] hover:underline"
                >
                  {workflow.name}
                </Link>
              </td>
              <td className="px-4 py-3">{workflow.description}</td>
              <td className="px-4 py-3 text-center">{workflow.nodes}</td>
              <td className="px-4 py-3 text-center">{workflow.executions}</td>
              <td className="px-4 py-3 text-center">{workflow.exceptions}</td>
              <td className="px-4 py-3">{workflow.timeSaved}h</td>
              <td className="px-4 py-3">
                ${Number(workflow.costSaved).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <Switch
                  checked={statusMap[index]}
                  onCheckedChange={(checked) => {
                    const confirmed = window.confirm(
                      `Are you sure you want to ${
                        checked ? "activate" : "deactivate"
                      } this workflow?`
                    );
                    if (confirmed) {
                      setStatusMap((prev) => ({ ...prev, [index]: checked }));
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface SortableTableHeadProps {
  title: string;
  field: SortField;
  currentSort: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

function SortableTableHead({
  title,
  field,
  currentSort,
  direction,
  onSort,
}: SortableTableHeadProps) {
  const isActive = currentSort === field;

  return (
    <th className="px-4 py-3 text-left font-medium">
      <button
        className="flex items-center gap-1 group"
        onClick={() => onSort(field)}
      >
        {title}
        <span
          className={`ml-1 h-4 w-4 ${
            isActive ? "opacity-100" : "opacity-30 group-hover:opacity-60"
          }`}
        >
          {isActive ? (
            direction === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </span>
      </button>
    </th>
  );
}
