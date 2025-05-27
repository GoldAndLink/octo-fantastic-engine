"use client";

import { Check, Link } from "lucide-react";
import useSWR, { mutate } from "swr";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

export default function ClientOverview() {
  const fetcher = (u: string) => fetch(u).then((r) => r.json());
  const { data, isLoading } = useSWR("/api/client/overview", fetcher);

  if (isLoading || !data) return <p>Loading…</p>;

  const pipelineOrder = [
    "DISCOVERY_INITIAL_SURVEY",
    "DISCOVERY_PROCESS_DEEP_DIVE",
    "ADA_PROPOSAL_SENT",
    "ADA_PROPOSAL_REVIEW_DONE",
    "ADA_CONTRACT_SENT",
    "ADA_CONTRACT_SIGNED",
    "CREDENTIALS_COLLECTED",
    "FACTORY_BUILD_INITIATED",
    "TEST_PLAN_GENERATED",
    "TESTING_STARTED",
    "PRODUCTION_DEPLOY",
  ] as const;

  const engineers = data.assigned_ses as any[];
  const clientUsers = data.client_users as any[];
  const docLinks = data.document_links as any[];

  const rows = data?.pipeline ?? [];

  const pipelineSteps = pipelineOrder.map((phase, i, arr) => {
    const row = rows.find((r: any) => r.title === phase) || {};
    const completed = !!row.completed_at;
    const previous =
      arr[i - 1] &&
      data.pipeline.find((r: any) => r.title === arr[i - 1])?.completed_at;
    return {
      title: phase
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      phase,
      status: completed ? "completed" : previous ? "pending" : "disabled",
      date: completed ? row.completed_at : undefined,
    };
  });

  async function handleMarkComplete(phase: string) {
    await fetch("/api/client/pipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase }),
    });
    mutate("/api/client/overview");
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[#1f2937]">
          Assigned Support Engineers
        </h2>
        <div className="flex flex-wrap gap-4">
          {engineers.map((e) => (
            <EngineerCard
              key={e.id}
              name={e.name}
              role={e.role}
              imageUrl="/assets/avatar-image.jpg"
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <Card className="overflow-hidden p-1 h-full">
            <div className="p-4 border-b border-[#e5e7eb]">
              <h3 className="font-medium text-[#1f2937]">Client Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#faf9f8]">
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Phone</TableHeader>
                    <TableHeader>Billing</TableHeader>
                    <TableHeader>Admin</TableHeader>
                    <TableHeader>Notes</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {clientUsers.map((u) => (
                    <tr key={u.id} className="border-b border-[#e5e7eb]">
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone}</TableCell>
                      <TableCell>
                        {u.billing ? (
                          <Check className="h-5 w-5 text-[#059669]" />
                        ) : (
                          <span className="block h-0.5 w-3 bg-[#757575]" />
                        )}
                      </TableCell>
                      <TableCell>
                        {u.admin ? (
                          <Check className="h-5 w-5 text-[#059669]" />
                        ) : (
                          <span className="block h-0.5 w-3 bg-[#757575]" />
                        )}
                      </TableCell>
                      <TableCell>{u.notes}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="h-full">
          <Card className="p-1 h-full">
            <div className="p-4 border-b border-[#e5e7eb]">
              <h3 className="font-medium text-[#1f2937]">Document Links</h3>
            </div>
            <div className="p-4 space-y-4">
              {docLinks.map((d, idx) => (
                <DocumentLink
                  key={`${d.kind}-${idx}`}
                  label={d.kind.replace(/_/g, " ").toLowerCase()}
                  url={d.url}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>

      <section>
        <Card className="p-1">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h3 className="font-medium text-[#1f2937]">Pipeline Progress</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {pipelineSteps.map((step) => (
                <PipelineStep
                  key={step.title}
                  title={step.title}
                  status={step.status}
                  date={step.date}
                  onMarkComplete={() => handleMarkComplete(step.phase)}
                />
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href="#"
      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
        active ? "bg-[#141417] text-white" : "text-[#3b3b3b] hover:bg-[#fcf6f0]"
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function EngineerCard({
  name,
  role,
  imageUrl,
}: {
  name: string;
  role: string;
  imageUrl: string;
}) {
  return (
    <Card className="p-4 flex flex-row items-center">
      <Avatar className="h-12 w-12">
        <img src={"/assets/avatar-image.jpg"} alt={name} />
      </Avatar>
      <div>
        <h4 className="font-medium text-[#1f2937]">{name}</h4>
        <p className="text-sm text-[#757575]">{role}</p>
      </div>
    </Card>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm text-[#1f2937]">{children}</td>;
}

function DocumentLink({ label, url }: { label: string; url: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-[#757575]">{label}</p>
      <Input
        value={url}
        className="text-sm"
        onChange={(e) => console.log(e.target.value)}
      />
    </div>
  );
}

function PipelineStep({
  title,
  status,
  date,
  onMarkComplete,
}: {
  title: string;
  status: string;
  date?: string;
  onMarkComplete?: () => void;
}) {
  return (
    <div className="flex items-start">
      <div className="mr-4 relative">
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center ${
            status === "completed"
              ? "bg-[#059669] text-white"
              : status === "pending"
              ? "border-2 border-[#757575] bg-white"
              : "border-2 border-[#ced4da] bg-white"
          }`}
        >
          {status === "completed" && <Check className="h-4 w-4" />}
        </div>
      </div>
      <div className="flex-1">
        <h4
          className={`font-medium ${
            status === "disabled" ? "text-[#757575]" : "text-[#1f2937]"
          }`}
        >
          {title}
        </h4>
        {status === "completed" && (
          <p className="text-sm text-[#757575]">Completed on {date}</p>
        )}
        {status === "pending" && onMarkComplete && (
          <Button
            variant="secondary"
            className="mt-2 bg-[#141417] text-white hover:bg-[#3b3b3b]"
            onClick={onMarkComplete}
          >
            Mark Complete
          </Button>
        )}
      </div>
    </div>
  );
}
