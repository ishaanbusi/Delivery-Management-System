"use client";

import TopNav from "@/components/dashboard/TopNav";
import MainContent from "@/components/dashboard/MainContent";
import ActionSidebar from "@/components/dashboard/ActionSidebar";
import { useSimulation } from "@/hooks/useSimulation";
import { Toaster } from "sonner";
import CommandPalette from "./CommandPalette";

export default function DashboardClient() {
  // Start the simulation loop now that data is hydrated
  useSimulation();

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">
      <CommandPalette />
      <TopNav />
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <MainContent />
        <ActionSidebar />
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
