import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

export function RecentInvoices() {
  const invoices = [
    { month: "April", year: 2025, number: "2025-04", amount: 2450 },
    { month: "March", year: 2025, number: "2025-03", amount: 2450 },
    { month: "February", year: 2025, number: "2025-02", amount: 2450 },
  ];

  return (
    <Card className="bg-white border border-[#e5e7eb] h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-black text-[#1f2937]">
          Recent Invoices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.number}
              className="flex items-center justify-between py-2 border-b border-[#e5e7eb] last:border-0"
            >
              <div>
                <h4 className="font-medium text-[#1f2937]">
                  {invoice.month} {invoice.year}
                </h4>
                <p className="text-sm text-[#757575]">
                  Invoice #{invoice.number}
                </p>
              </div>
              <div className="flex items-center">
                <span className="mr-2 font-medium">
                  ${invoice.amount.toFixed(2)}
                </span>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/invoices/${invoice.number}`}>
                    <Download className="h-4 w-4 text-[#757575]" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          <Link
            href="/invoices"
            className="text-sm text-[#4e86cf] flex items-center hover:underline mt-8 font-semibold"
          >
            View all invoices <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
