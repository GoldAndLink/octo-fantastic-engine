import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Circle, MessageSquare } from "lucide-react";
import Link from "next/link";
export default function DashboardPage() {

  const pipelineSteps = [
    {
      title: "Discovery: Initial Survey",
      status: "completed",
      date: "Completed Jan 15, 2025",
    },
    {
      title: "Discovery: Process deep dive",
      status: "completed",
      date: "Completed Jan 20, 2025",
    },
    {
      title: "ADA Proposal Sent",
      status: "completed",
      date: "Completed Jan 25, 2025",
    },
    {
      title: "ADA Proposal Review",
      status: "in-progress",
      date: "In Progress",
    },
    {
      title: "ADA Contract Sent",
      status: "pending",
      date: "",
    },
    {
      title: "ADA Contract Signed",
      status: "pending",
      date: "",
    },
    {
      title: "Credentials collected",
      status: "pending",
      date: "",
    },
    {
      title: "Factory build initiated",
      status: "pending",
      date: "",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-8 items-start">
      <Card className="col-span-12 md:col-span-5">
        <CardHeader>
          <CardTitle className="text-2xl">Pipeline Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pipelineSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              {step.status === "completed" && (
                <Circle className="h-3 w-3 text-[#1D8560] fill-green-700 mt-0.5 mr-3 flex-shrink-0" />
              )}
              {step.status === "in-progress" && (
                <Circle className="h-3 w-3 text-[#4E86CF] mt-0.5 mr-3 flex-shrink-0 fill-[#4E86CF]" />
              )}
              {step.status === "pending" && (
                <Circle className="h-3 w-3 text-[#E5E7EB] fill-[#E5E7EB] mt-0.5 mr-3 flex-shrink-0" />
              )}
              <div>
                {step.status !== "pending" && (
                  <p className="text-md font-medium">{step.title}</p>
                )}
                {step.status === "pending" && (
                  <p className="text-md font text-gray-500">{step.title}</p>
                )}
                {step.date && (
                  <p className="text-sm text-gray-500">{step.date}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="col-span-12 md:col-span-4 space-y-5">
        <Card>
          <CardContent className="pt-2">
            <p className="text-sm text-gray-500">Time Saved</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-3xl font-bold">24.5 hrs</p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
              <div className="text-left">
                <p className="text-3xl font-bold">168.2 hrs</p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-2">
            <p className="text-sm text-gray-500">Money Saved</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-3xl font-bold">$2,450</p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
              <div className="text-left">
                <p className="text-3xl font-bold">$16,820</p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-2">
            <p className="text-sm text-gray-500">Active Workflows</p>
            <p className="text-3xl font-bold mt-2">12</p>
            <Link
              href="/workflows"
              className="text-sm text-blue-500 flex items-center mt-2 hover:underline"
            >
              View workflows <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-12 md:col-span-3 self-start">
        <CardContent className="pt-2 flex flex-col items-center text-center">
          <div className="flex flex-row items-center gap-4 w-full">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/assets/avatar-image.jpg" alt="John Smith" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center">
              <h3 className="font-semibold text-xl text-gray-900">
                John Smith
              </h3>
              <p className="text-sm text-gray-500">Solutions Engineer</p>
            </div>
          </div>
          <Button
            className="mt-6 p-6 w-full rounded-xl bg-black"
            variant="default"
          >
            <MessageSquare className="size-6 text-white" />
            <span className="mr-2 text-lg text-white">Message SE</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
