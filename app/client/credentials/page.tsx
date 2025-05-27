import { CredentialsManager } from "@/components/credentials-manager";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <main className="p-6">
          <CredentialsManager />
        </main>
      </div>
    </div>
  );
}
