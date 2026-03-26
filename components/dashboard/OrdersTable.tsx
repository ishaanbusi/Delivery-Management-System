"use client";

import { useRef } from "react";
import { OrderStatus } from "@/types/dashboard";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { selectOrder } from "@/store/dashboardSlice";
import { MoreVertical, Clock, MapPin, User, TrendingUp } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    dotColor: "bg-amber-500",
  },
  dispatched: {
    label: "Dispatched",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    dotColor: "bg-blue-500",
  },
  in_transit: {
    label: "In Transit",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    dotColor: "bg-indigo-500",
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    dotColor: "bg-emerald-500",
  },
  delayed: {
    label: "Delayed",
    color: "text-red-700",
    bgColor: "bg-red-50",
    dotColor: "bg-red-500",
  },
};

const gridLayout =
  "grid grid-cols-[130px_90px_1.5fr_2fr_160px_120px_60px] w-full items-center";

export default function OrdersTable() {
  // REDUX REFACTOR
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.dashboard.orders);
  const selectedOrderId = useAppSelector(
    (state) => state.dashboard.selectedOrderId,
  );

  const activeOrders = orders.filter((o) => o.status !== "delivered");
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: activeOrders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 76,
    overscan: 5,
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-0">
      {/* HEADER */}
      <div
        className={`${gridLayout} bg-slate-50 border-b border-slate-200 z-20 shrink-0 pr-2`}
      >
        <div className="px-6 py-4 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Order ID
          </span>
        </div>
        <div className="px-4 py-4 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Time
          </span>
        </div>
        <div className="px-4 py-4 flex items-center space-x-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Customer
          </span>
        </div>
        <div className="px-4 py-4 flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Destination
          </span>
        </div>
        <div className="px-4 py-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Driver
          </span>
        </div>
        <div className="px-4 py-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Status
          </span>
        </div>
        <div className="px-4 py-4 text-right">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Actions
          </span>
        </div>
      </div>

      {/* BODY */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const order = activeOrders[virtualRow.index];
            const status = statusConfig[order.status];
            const isSelected = selectedOrderId === order.id;

            return (
              <div
                key={order.id}
                onClick={() => dispatch(selectOrder(order.id))} // REDUX DISPATCH
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className={`${gridLayout} cursor-pointer transition-colors border-b border-slate-100/80 ${
                  isSelected
                    ? "bg-indigo-50/60 hover:bg-indigo-50/80"
                    : "hover:bg-slate-50/50"
                }`}
              >
                <div className="px-6 h-full flex items-center">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-1 h-8 rounded-full transition-colors ${isSelected ? "bg-indigo-600" : "bg-transparent"}`}
                    ></div>
                    <span className="font-bold text-slate-900 text-sm">
                      {order.id}
                    </span>
                  </div>
                </div>
                <div className="px-4">
                  <span className="text-sm font-semibold text-slate-500">
                    {order.timeElapsed}
                  </span>
                </div>
                <div className="px-4 overflow-hidden">
                  <p className="font-bold text-slate-900 leading-tight truncate">
                    {order.customerName}
                  </p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        order.customerTier === "gold"
                          ? "bg-amber-100 text-amber-700"
                          : order.customerTier === "silver"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {order.customerTier}
                    </span>
                  </div>
                </div>
                <div className="px-4 overflow-hidden">
                  <p
                    className="text-sm font-medium text-slate-600 truncate"
                    title={order.deliveryAddress}
                  >
                    {order.deliveryAddress}
                  </p>
                </div>
                <div className="px-4 overflow-hidden">
                  {order.assignedDriver ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-700 border border-slate-200 shrink-0 shadow-sm">
                        {order.assignedDriver
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {order.assignedDriver}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-slate-400 italic">
                      Unassigned
                    </span>
                  )}
                </div>
                <div className="px-4">
                  <div
                    className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded-md ${status.bgColor} border border-white/40 shadow-sm`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}
                    ></div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
                <div className="px-4 flex justify-end">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-700"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
