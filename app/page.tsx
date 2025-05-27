/**
 * Home page component that serves as the entry point of the application.
 * This component automatically redirects users to the sign-in page.
 * 
 * Note: This ensures that all users must authenticate before accessing
 * any other part of the application.
 */
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the sign-in page immediately when this component renders
  redirect("/auth/signin");
  return null;
}
