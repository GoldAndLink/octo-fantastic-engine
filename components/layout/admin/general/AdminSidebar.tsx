"use client";

import { cn } from "@/lib/utils";
import braintrustLogo from "@/public/assets/braintrust_logo.png";
import {
  AlertTriangle,
  Building2,
  CreditCard,
  FileBarChart,
  Home,
  MessageSquare,
  Repeat,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, UsersIcon, ClientsIcon, BillingIcon, SubscriptionsIcon, MessagingIcon, ReportingIcon, ExceptionsIcon } from "@/components/ui/icons/sidebar-icons";


const menuItems = [
  { name: "Dashboard", icon: DashboardIcon, href: "/admin" },
  { name: "Users", icon: UsersIcon, href: "/admin/users" },
  { name: "Clients", icon: ClientsIcon, href: "/admin/clients" },
  { name: "Billing", icon: BillingIcon, href: "/admin/billing" },
  { name: "Subscriptions", icon: SubscriptionsIcon, href: "/admin/subscriptions" },
  { name: "Messaging", icon: MessagingIcon, href: "/admin/messaging" },
  { name: "Reporting", icon: ReportingIcon, href: "/admin/reporting" },
  { name: "Exceptions", icon: ExceptionsIcon, href: "/admin/exceptions" },
];

export default function AdminSidebar() {
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
        {menuItems.map((item) => {
          let isActive;
          if (item.href === "/admin") {
            isActive = pathname === "/admin";
          } else {
            isActive = pathname.startsWith(item.href);
          }
          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-[#E3DDDD]"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon />
                {item.name}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
