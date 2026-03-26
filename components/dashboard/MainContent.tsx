"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { selectOrder } from "@/store/dashboardSlice";
import OrdersTable from "./OrdersTable";
import DriverRoster from "./DriverRoster";
import ExceptionsView from "./ExceptionsView";
import dynamic from "next/dynamic";
import {
  Package,
  Users,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Dynamically import Leaflet map to avoid Next.js SSR crashes
const LiveMap = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center border border-slate-200 shadow-inner">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Initializing Map Engine...
        </p>
      </div>
    </div>
  ),
});

export default function MainContent() {
  // REDUX REFACTOR: Hooking into the RTK Store
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.dashboard.orders);
  const drivers = useAppSelector((state) => state.dashboard.drivers);
  const isMapMode = useAppSelector((state) => state.dashboard.isMapMode);

  const [activeTab, setActiveTab] = useState<
    "orders" | "drivers" | "exceptions"
  >("orders");

  const activeOrders = orders.filter((o) => o.status !== "delivered");
  const delayedOrders = orders.filter((o) => o.status === "delayed");
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  const tabs = [
    {
      id: "orders" as const,
      label: "Active Orders",
      count: activeOrders.length,
      icon: Package,
    },
    {
      id: "drivers" as const,
      label: "Driver Roster",
      count: drivers.length,
      icon: Users,
    },
    {
      id: "exceptions" as const,
      label: "Exceptions",
      count: delayedOrders.length,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 border-r border-slate-200/50 min-h-0">
      {/* Header & Tabs */}
      <div className="bg-white px-6 pt-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
          Operations Center
        </h2>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Volume
              </p>
              <p className="text-base font-bold text-slate-900">
                {orders.length} Deliveries
              </p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Completion
              </p>
              <p className="text-base font-bold text-slate-900">
                {deliveredOrders.length} Completed
              </p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center space-x-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Avg Transit
              </p>
              <p className="text-base font-bold text-slate-900">24 mins</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-8 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-3 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-700"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] transition-colors ${
                    activeTab === tab.id
                      ? tab.id === "exceptions" && tab.count > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Data View */}
      <div className="flex-1 overflow-hidden bg-slate-50/50 p-4 min-h-0 flex flex-col">
        {isMapMode ? (
          <div className="w-full h-full flex-1 min-h-0 rounded-2xl overflow-hidden">
            <LiveMap />
          </div>
        ) : (
          <div className="flex-1 overflow-auto custom-scrollbar h-full min-h-0">
            {/* Orders Table */}
            {activeTab === "orders" && <OrdersTable />}

            {/* Driver Roster */}
            {activeTab === "drivers" && <DriverRoster drivers={drivers} />}

            {/* Exceptions */}
            {activeTab === "exceptions" && (
              <ExceptionsView
                orders={delayedOrders}
                onSelectOrder={(order: any) => dispatch(selectOrder(order.id))}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
