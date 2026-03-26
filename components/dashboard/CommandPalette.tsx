"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { selectOrder } from "@/store/dashboardSlice";
import { Search, Truck, Package, X, ArrowRight } from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  // REDUX REFACTOR
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.dashboard.orders);
  const drivers = useAppSelector((state) => state.dashboard.drivers);

  // Toggle with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-slate-900/40 backdrop-blur-sm p-4">
      <Command
        className="w-full max-w-[640px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200"
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      >
        <div className="flex items-center border-b border-slate-100 px-4 py-3">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <Command.Input
            autoFocus
            placeholder="Search orders, drivers, or type a command..."
            className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-slate-100 rounded-md"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
          <Command.Empty className="py-6 text-center text-sm text-slate-500 font-medium">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Active Orders"
            className="px-2 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
          >
            {orders
              .filter((o) => o.status !== "delivered")
              .map((order) => (
                <Command.Item
                  key={order.id}
                  onSelect={() => {
                    dispatch(selectOrder(order.id)); // REDUX DISPATCH
                    setOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-3 mt-1 rounded-xl cursor-pointer hover:bg-indigo-50 group transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-50 group-hover:bg-white rounded-lg border border-slate-100 transition-colors">
                      <Package className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {order.id}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {order.customerName}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                </Command.Item>
              ))}
          </Command.Group>

          <Command.Group
            heading="Drivers"
            className="px-2 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 mt-2"
          >
            {drivers.map((driver) => (
              <Command.Item
                key={driver.id}
                onSelect={() => {}} // You can add driver selection logic later if needed
                className="flex items-center justify-between px-3 py-3 mt-1 rounded-xl cursor-pointer hover:bg-emerald-50 group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 group-hover:bg-white rounded-lg border border-slate-100 transition-colors">
                    <Truck className="w-4 h-4 text-slate-500 group-hover:text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {driver.name}
                    </p>
                    <p className="text-xs text-slate-500 font-medium capitalize">
                      {driver.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-500 border border-slate-200 group-hover:border-emerald-200 px-2 py-0.5 rounded-md uppercase">
                  Assign
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center space-x-4">
            <span className="text-[10px] text-slate-400 font-bold">
              <kbd className="font-sans border border-slate-300 px-1 rounded bg-white mr-1 shadow-sm">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              <kbd className="font-sans border border-slate-300 px-1 rounded bg-white mr-1 shadow-sm">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">
            CoreSynix Quick-Action
          </span>
        </div>
      </Command>
    </div>
  );
}
