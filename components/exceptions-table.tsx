"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type ExceptionType =
  | "Authentication"
  | "Data process"
  | "Integration"
  | "Workflow logic"
  | "Browser automation";
type Severity = "Critical" | "High" | "Medium" | "Low";
type Status = "New" | "In Progress" | "Resolved" | "Ignored";

interface Notification {
  id: string;
  name: string;
  email: string;
  method: "email" | "SMS";
  timestamp: string;
  avatar?: string;
}

interface Exception {
  id: string;
  dateReported: string;
  clientName: string;
  department: string;
  workflowName: string;
  notifications: Notification[];
  exceptionType: ExceptionType;
  severity: Severity;
  remedy: string;
  status: Status;
}

const mockData: Exception[] = [
  {
    id: "1",
    dateReported: "2025-05-14 12:30:00",
    clientName: "Acme Corp",
    department: "Finance",
    workflowName: "Invoice Processing",
    notifications: [
      {
        id: "n1",
        name: "John Doe",
        email: "john@acme.com",
        method: "email",
        timestamp: "2025-05-14 12:31:00",
      },
      {
        id: "n2",
        name: "Jane Smith",
        email: "jane@acme.com",
        method: "SMS",
        timestamp: "2025-05-14 12:32:00",
      },
      {
        id: "n3",
        name: "Bob Wilson",
        email: "bob@acme.com",
        method: "email",
        timestamp: "2025-05-14 12:33:00",
      },
      {
        id: "n4",
        name: "Alice Brown",
        email: "alice@acme.com",
        method: "email",
        timestamp: "2025-05-14 12:34:00",
      },
    ],
    exceptionType: "Integration",
    severity: "Critical",
    remedy: "API timeout",
    status: "New",
  },
  {
    id: "2",
    dateReported: "2025-05-14 11:15:00",
    clientName: "TechStart Inc",
    department: "HR",
    workflowName: "Employee Onboarding",
    notifications: [
      {
        id: "n5",
        name: "Sarah Johnson",
        email: "sarah@techstart.com",
        method: "email",
        timestamp: "2025-05-14 11:16:00",
      },
      {
        id: "n6",
        name: "Mike Davis",
        email: "mike@techstart.com",
        method: "SMS",
        timestamp: "2025-05-14 11:17:00",
      },
    ],
    exceptionType: "Authentication",
    severity: "High",
    remedy: "Invalid credentials",
    status: "In Progress",
  },
  {
    id: "3",
    dateReported: "2025-05-14 09:45:00",
    clientName: "Global Solutions",
    department: "Operations",
    workflowName: "Data Sync",
    notifications: [
      {
        id: "n7",
        name: "Tom Harris",
        email: "tom@global.com",
        method: "email",
        timestamp: "2025-05-14 09:46:00",
      },
    ],
    exceptionType: "Data process",
    severity: "Medium",
    remedy: "Schema mismatch",
    status: "Resolved",
  },
  {
    id: "4",
    dateReported: "2025-05-13 16:20:00",
    clientName: "Retail Plus",
    department: "Sales",
    workflowName: "Order Processing",
    notifications: [
      {
        id: "n8",
        name: "Emma Wilson",
        email: "emma@retail.com",
        method: "SMS",
        timestamp: "2025-05-13 16:21:00",
      },
      {
        id: "n9",
        name: "Chris Lee",
        email: "chris@retail.com",
        method: "email",
        timestamp: "2025-05-13 16:22:00",
      },
      {
        id: "n10",
        name: "Pat Taylor",
        email: "pat@retail.com",
        method: "email",
        timestamp: "2025-05-13 16:23:00",
      },
    ],
    exceptionType: "Workflow logic",
    severity: "Low",
    remedy: "Missing field validation",
    status: "New",
  },
  {
    id: "5",
    dateReported: "2025-05-13 14:00:00",
    clientName: "Acme Corp",
    department: "IT",
    workflowName: "System Backup",
    notifications: [
      {
        id: "n11",
        name: "Alex Chen",
        email: "alex@acme.com",
        method: "email",
        timestamp: "2025-05-13 14:01:00",
      },
    ],
    exceptionType: "Browser automation",
    severity: "Medium",
    remedy: "Element not found",
    status: "Ignored",
  },
];

type SortField =
  | "dateReported"
  | "clientName"
  | "department"
  | "workflowName"
  | "exceptionType"
  | "severity"
  | "remedy"
  | "status";
type SortDirection = "asc" | "desc";

export default function ExceptionsTable() {
  const [data, setData] = useState<Exception[]>(mockData);
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [exceptionTypeFilter, setExceptionTypeFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("dateReported");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const uniqueClients = Array.from(
    new Set(mockData.map((item) => item.clientName))
  );
  const exceptionTypes: ExceptionType[] = [
    "Authentication",
    "Data process",
    "Integration",
    "Workflow logic",
    "Browser automation",
  ];
  const severityLevels: Severity[] = ["Critical", "High", "Medium", "Low"];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = (id: string, newStatus: Status) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredAndSortedData = data
    .filter((item) => {
      if (clientFilter !== "all" && item.clientName !== clientFilter)
        return false;
      if (
        exceptionTypeFilter !== "all" &&
        item.exceptionType !== exceptionTypeFilter
      )
        return false;
      if (severityFilter !== "all" && item.severity !== severityFilter)
        return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "severity") {
        const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        aValue = severityOrder[a.severity as keyof typeof severityOrder];
        bValue = severityOrder[b.severity as keyof typeof severityOrder];
      }

      if (sortField === "dateReported") {
        aValue = new Date(a.dateReported).getTime();
        bValue = new Date(b.dateReported).getTime();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="w-full space-y-4">
      <Card className="w-full">
        <CardContent className="">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                Client name
              </span>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All clients</SelectItem>
                  {uniqueClients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                Exception type
              </span>
              <Select
                value={exceptionTypeFilter}
                onValueChange={setExceptionTypeFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {exceptionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                Severity
              </span>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  {severityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("dateReported")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Datetime reported
                  <SortIcon field="dateReported" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("clientName")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Client name
                  <SortIcon field="clientName" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("department")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Department
                  <SortIcon field="department" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("workflowName")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Workflow name
                  <SortIcon field="workflowName" />
                </Button>
              </TableHead>
              <TableHead>Notifications</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("exceptionType")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Exception type
                  <SortIcon field="exceptionType" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("severity")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Severity
                  <SortIcon field="severity" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("remedy")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Remedy
                  <SortIcon field="remedy" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Status
                  <SortIcon field="status" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {filteredAndSortedData.map((exception) => (
              <TableRow key={exception.id}>
                <TableCell className="font-mono text-sm">
                  {exception.dateReported}
                </TableCell>
                <TableCell>{exception.clientName}</TableCell>
                <TableCell>{exception.department}</TableCell>
                <TableCell>{exception.workflowName}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-2">
                        {exception.notifications
                          .slice(0, 2)
                          .map((notification) => (
                            <Tooltip key={notification.id}>
                              <TooltipTrigger asChild>
                                <Avatar className="h-8 w-8 border-2 border-background">
                                  <AvatarImage
                                    src={
                                      notification.avatar || "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback className="text-xs">
                                    {notification.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-sm">
                                  <p className="font-medium">
                                    {notification.name}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {notification.email}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {notification.method === "email"
                                      ? "📧"
                                      : "📱"}{" "}
                                    {notification.timestamp}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                      </div>
                      {exception.notifications.length > 2 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-muted-foreground cursor-default">
                              +{exception.notifications.length - 2} more
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-2">
                              {exception.notifications
                                .slice(2)
                                .map((notification) => (
                                  <div
                                    key={notification.id}
                                    className="text-sm"
                                  >
                                    <p className="font-medium">
                                      {notification.name}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {notification.email}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {notification.method === "email"
                                        ? "📧"
                                        : "📱"}{" "}
                                      {notification.timestamp}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{exception.exceptionType}</TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(exception.severity)}>
                    {exception.severity}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {exception.remedy}
                </TableCell>
                <TableCell>
                  <Select
                    value={exception.status}
                    onValueChange={(value) =>
                      handleStatusChange(exception.id, value as Status)
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Ignored">Ignored</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
