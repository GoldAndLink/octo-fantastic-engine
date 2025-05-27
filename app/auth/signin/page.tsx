"use client";

import braintrustLogo from "@/public/assets/braintrust_logo.png";
import { supabaseBrowser } from "@/src/utils/supabase/client";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Form = { email: string; password: string };

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm<Form>();

  async function onSubmit(values: Form) {
    const { data, error } = await supabaseBrowser().auth.signInWithPassword(
      values
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    const role = data.user.user_metadata?.role as "ADMIN" | "SE" | "CLIENT";
    router.replace(role === "ADMIN" || role === "SE" ? "/admin" : "/client");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-[#faf9f8] border-r border-[#e5e7eb] p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <div className="h-10 w-10 rounded-md bg-[#faf9f8] flex items-center justify-center overflow-hidden">
            <Image
              src={braintrustLogo}
              alt="Braintrust Logo"
              width={36}
              height={36}
            />
          </div>
          <div>
            <h2 className="font-bold text-xl text-[#141417]">Braintrust Nexus</h2>
            <p className="text-xs text-[#3b3b3b] font-light">Dashboard</p>
          </div>
        </div>

        <div className="space-y-1 mt-auto text-right">
          <p className="text-xs text-[#3b3b3b] opacity-70">
            © 2025 Braintrust
          </p>
          <p className="text-xs text-[#3b3b3b] opacity-70">
            All rights reserved
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#141417]">Sign in</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: true })}
                placeholder="Enter your email"
                className="w-full h-10 px-3 border border-[#dbdbdb] rounded-md focus:border-[#1f2937] focus:ring-[#1f2937] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Enter your password"
                  className="w-full h-10 px-3 border border-[#dbdbdb] rounded-md focus:border-[#1f2937] focus:ring-[#1f2937] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3b3b3b]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-[#141417] hover:bg-[#1f2937] text-white rounded-md flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
