import PlanForm from "@/components/plan-form";

export default function Home() {
  return (
    <div className="">
      <main className="max-w-4xl mx-auto py-4">
        <h1 className="text-3xl font-bold mb-8">Add New Plan</h1>
        <PlanForm />
      </main>
    </div>
  );
}
