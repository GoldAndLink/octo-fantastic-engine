/**
 * Root layout component for the Braintrust Nexus Dashboard application.
 * This component wraps all pages and provides common layout elements.
 * 
 * Features:
 * - Sets up the HTML document structure
 * - Applies global styles
 * - Configures toast notifications
 * - Sets metadata for SEO
 */
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

// Application metadata for SEO and browser tab display
export const metadata = {
  title: "Braintrust Nexus Dashboard",
  description: "Dashboard for managing third-party service integrations",
};

/**
 * RootLayout component that provides the base HTML structure
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render within the layout
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-muted font-sans antialiased">
        {children}
        {/* Global toast notifications container */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
