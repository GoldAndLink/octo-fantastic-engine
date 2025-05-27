"use client";

import ClientOverview from "@/components/clients/ClientOverview";
import ClientWorkflows from "@/components/clients/ClientWorkflows";
import { useState } from "react";

export default function ClientManagerPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "workflows">(
    "overview"
  );

  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div className="flex border-b border-[#e5e7eb] mb-6 gap-8">
            <button
              className={`pb-2 text-lg font-medium transition-colors ${
                activeTab === "overview"
                  ? "border-b-2 border-[#141417] text-[#141417]"
                  : "text-[#757575] hover:text-[#141417]"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`pb-2 text-lg font-medium transition-colors ${
                activeTab === "workflows"
                  ? "border-b-2 border-[#141417] text-[#141417]"
                  : "text-[#757575] hover:text-[#141417]"
              }`}
              onClick={() => setActiveTab("workflows")}
            >
              Client Workflows
            </button>
          </div>
          {activeTab === "overview" && <ClientOverview />}
          {activeTab === "workflows" && <ClientWorkflows />}
        </div>
      </div>
    </div>
  );
}
