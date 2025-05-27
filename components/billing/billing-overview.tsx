import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-black text-[#1f2937]">
          Billing Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-[#e5e7eb]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-[#757575]">
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-black text-[#1f2937]">Enterprise</h3>
              <p className="text-[#3b3b3b]">$2,000/month base fee</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-[#e5e7eb]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-[#757575]">
                Credits Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold text-[#1f2937]">8,450</h3>
              <p className="text-[#3b3b3b]">Renews on May 1, 2025</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-[#e5e7eb]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-[#757575]">
                SE Hours This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-black text-[#1f2937]">12.5 / 20</h3>
              <p className="text-[#3b3b3b]">7.5 hours remaining</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
