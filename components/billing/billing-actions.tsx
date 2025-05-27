import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function BillingActions() {
  return (
    <Card className="bg-white border border-[#e5e7eb] mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#1f2937]">
          Billing Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-medium text-[#1f2937] mb-4">
              Payment Method
            </h3>
            <div className="flex items-center space-x-3 p-4 border border-[#e5e7eb] rounded-md">
              <div className="h-8 w-12 relative flex-shrink-0">
                <div className="bg-[#1a1f71] h-full w-full rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
              </div>
              <div>
                <p className="font-medium text-[#1f2937]">
                  Visa ending in 4242
                </p>
                <p className="text-sm text-[#757575]">Expires 12/25</p>
              </div>
            </div>
            <Link
              href="/billing/payment-method"
              className="text-sm text-[#4e86cf] hover:underline mt-3 inline-block font-semibold"
            >
              Update payment method
            </Link>
          </div>

          <div>
            <h3 className="text-base font-medium text-[#1f2937] mb-4">
              Need Help?
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-center font-bold"
              >
                Download Contract
              </Button>
              <Button className="w-full justify-center bg-[#141417] hover:bg-black font-bold">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
