"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ClientRow {
  id: string;
  name: string;
  contract_start: string;
  workflows: number;
  nodes: number;
  executions: number;
  exceptions: number;
  revenue: number;
  time_saved?: number;
  money_saved?: number;
}

type SortField =
  | "name"
  | "contract_start"
  | "workflows"
  | "nodes"
  | "executions"
  | "exceptions"
  | "revenue";

type SortDirection = "asc" | "desc";

export default function ClientsTable() {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [range] = useState("itd");

  const {
    data: clients,
    isLoading,
    error,
  } = useSWR<ClientRow[]>(
    `/api/admin/clients?range=${range}&sort=${sortField}&dir=${sortDir}`,
    fetcher
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  if (isLoading) return <p className="p-4">Loading…</p>;
  if (error || !clients || !Array.isArray(clients)) return <p className="p-4">Error loading clients</p>;

  return (
    <div className="border border-[#e5e7eb] rounded-b-md overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#faf9f8] border-b border-[#e5e7eb]">
            <SortableHead
              title="Client Name"
              field="name"
              current={sortField}
              dir={sortDir}
              onSort={handleSort}
            />
            <SortableHead
              title="Contract Start"
              field="contract_start"
              current={sortField}
              dir={sortDir}
              onSort={handleSort}
            />
            <SortableHead
              title="Workflows"
              field="workflows"
              current={sortField}
              dir={sortDir}
              onSort={handleSort}
            />
            <SortableHead
              title="Nodes"
              field="nodes"
              current={sortField}
              dir={sortDir}
              onSort={handleSort}
            />
            <SortableHead
              title="Executions"
              field="executions"
              current={sortField}
              dir={sortDir}
              onSort={handleSort}
            />
            <SortableHead
              title="Exceptions"
              field="exceptions"
              current={sortField}
              dir={sortDir}
              onSort={handleSort}
            />
            <SortableHead
              title="Revenue"
              field="revenue"
              current={sortField}
              dir={sortDir}
              onSort={handleSort}
            />
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => (
            <tr
              key={c.id}
              className="border-b border-[#e5e7eb] bg-white hover:bg-[#faf9f8]"
            >
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/clients/${c.id}`}
                  className="text-[#4e86cf] hover:underline"
                >
                  {c.name}
                </Link>
              </td>

              <td className="px-4 py-3">
                <Link
                  href={`/contracts/${c.id}`}
                  className="text-[#4e86cf] hover:underline"
                >
                  {new Date(c.contract_start).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Link>
              </td>

              <td className="px-4 py-3 text-center">
                <Link
                  href={`/clients/${c.id}/workflows`}
                  className="text-[#4e86cf] hover:underline"
                >
                  {c.workflows}
                </Link>
              </td>

              <td className="px-4 py-3 text-center">{c.nodes}</td>

              <td className="px-4 py-3 text-center">
                <Link
                  href={`/clients/${c.id}/executions`}
                  className="text-[#4e86cf] hover:underline"
                >
                  {c.executions.toLocaleString()}
                </Link>
              </td>

              <td className="px-4 py-3 text-center">
                <Link
                  href={`/clients/${c.id}/exceptions`}
                  className="text-[#4e86cf] hover:underline"
                >
                  {c.exceptions}
                </Link>
              </td>

              <td className="px-4 py-3 text-center">
                ${c.revenue.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


interface HeadProps {
  title: string;
  field: SortField;
  current: SortField;
  dir: SortDirection;
  onSort: (f: SortField) => void;
}

function SortableHead({ title, field, current, dir, onSort }: HeadProps) {
  const active = current === field;
  return (
    <th className="px-4 py-3 text-left font-medium">
      <button
        onClick={() => onSort(field)}
        className="group flex items-center gap-1"
      >
        {title}
        <span
          className={`ml-1 h-4 w-4 ${
            active ? "opacity-100" : "opacity-30 group-hover:opacity-60"
          }`}
        >
          {active ? (
            dir === "asc" ? (
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
