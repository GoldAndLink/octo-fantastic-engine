import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function UsageSummary() {
  return (
    <Card className="bg-white border border-[#e5e7eb] h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-black text-[#1f2937]">
          Usage Summary
        </CardTitle>
        <Link
          href="/reports/usage"
          className="text-sm text-[#4e86cf] flex items-center hover:underline font-semibold"
        >
          View detailed report <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <UsageItem label="API Calls" value="245,678" />
          <UsageItem label="Storage Used" value="1.2 TB" />
          <UsageItem label="Active Users" value="127" />
        </div>
      </CardContent>
    </Card>
  );
}

interface UsageItemProps {
  label: string;
  value: string;
}

function UsageItem({ label, value }: UsageItemProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#e5e7eb] last:border-0">
      <span className="text-[#3b3b3b]">{label}</span>
      <span className="font-medium text-[#1f2937]">{value}</span>
    </div>
  );
}
