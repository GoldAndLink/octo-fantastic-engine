import WorkflowTable from "@/components/workflow/workflow-table";
import { Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Workflow ROI</h2>
            <button className="bg-black text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-sm">
              <Plus className="h-4 w-4" />
              New Workflow
            </button>
          </div>

          <WorkflowTable />
        </main>
      </div>
    </div>
  );
}
