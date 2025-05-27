"use client";

import braintrustLogo from "@/public/assets/braintrust_logo.png";
import {
  AlertTriangle,
  BarChart2,
  CreditCard,
  FileBarChart,
  Home,
  Key,
  MessageSquare,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ClientSidebar() {
  const pathname = usePathname();
  return (
    <div className="w-[194px] h-full bg-[#FAF9F8] border-r flex flex-col">
      <div className="p-4 flex justify-center">
        <button className="p-2 rounded-full hover:bg-gray-200">
          <Image
            src={braintrustLogo}
            alt="Braintrust Logo"
            width={32}
            height={32}
          />
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-3">
        <Link
          href="/client"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname === "/client"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Home className="mr-3 h-6 w-6 text-gray-500" />
          Dashboard
        </Link>

        <Link
          href="/client/workflow"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname.startsWith("/client/workflow")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <BarChart2 className="mr-3 h-6 w-6 text-gray-500" />
          ROI
        </Link>

        <Link
          href="/client/reporting"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname.startsWith("/client/reporting")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FileBarChart className="mr-3 h-6 w-6 text-gray-500" />
          Reporting
        </Link>

        <Link
          href="/client/credentials"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname.startsWith("/client/credentials")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Key className="mr-3 h-6 w-6 text-gray-500" />
          Credentials
        </Link>

        <Link
          href="/client/exceptions"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname.startsWith("/client/exceptions")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <AlertTriangle className="mr-3 h-6 w-6 text-gray-500" />
          Exceptions
        </Link>

        <Link
          href="/client/users"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname.startsWith("/client/users")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Users className="mr-3 h-6 w-6 text-gray-500" />
          Users
        </Link>

        <Link
          href="/client/billing"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname.startsWith("/client/billing")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <CreditCard className="mr-3 h-6 w-6 text-gray-500" />
          Billing
        </Link>

        <Link
          href="/client/messaging"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            pathname.startsWith("/client/messaging")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <MessageSquare className="mr-3 h-6 w-6 text-gray-500" />
          Messaging
        </Link>
      </nav>
    </div>
  );
}
