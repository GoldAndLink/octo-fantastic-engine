import { ClientForm } from "@/components/clients/client-form";

export default function Home() {
  return (
    <div className="flex h-screen bg-[#faf9f8]">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <ClientForm />
        </div>
      </div>
    </div>
  );
}
