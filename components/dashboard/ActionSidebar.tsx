"use client";

import { useAppSelector, useAppDispatch } from "@/store/store";
import { dispatchOrder } from "@/store/dashboardSlice";
import { Package, MapPin, Phone, Mail, Star, Truck } from "lucide-react";
import { toast } from "sonner";

export default function ActionSidebar() {
  // REDUX REFACTOR
  const dispatch = useAppDispatch();
  const drivers = useAppSelector((state) => state.dashboard.drivers);
  const selectedOrderId = useAppSelector(
    (state) => state.dashboard.selectedOrderId,
  );

  // Find the selected order dynamically
  const order = useAppSelector((state) =>
    state.dashboard.orders.find((o) => o.id === selectedOrderId),
  );

  if (!order) {
    return (
      <div className="w-[380px] bg-white border-l border-slate-200 flex flex-col items-center justify-center p-8 text-center flex-shrink-0 z-20">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          No Order Selected
        </h3>
        <p className="text-sm text-slate-500 font-medium">
          Select an order from the table to view details and dispatch.
        </p>
      </div>
    );
  }

  const handleDispatch = () => {
    const availableDriver =
      drivers.find((d) => d.status === "available") || drivers[0];

    // REDUX DISPATCH
    dispatch(
      dispatchOrder({ orderId: order.id, driverId: availableDriver.id }),
    );

    toast.success(`Order ${order.id} dispatched!`, {
      description: `Assigned to ${availableDriver.name}`,
    });
  };

  const handleReassign = () => {
    toast.info("Driver Reassignment Opened", {
      description: "Select a new driver from the roster.",
    });
  };

  return (
    <div className="w-[380px] bg-white border-l border-slate-200 flex flex-col flex-shrink-0 z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Order Details
        </h2>
        <span className="text-indigo-600 font-bold tracking-wider">
          {order.id}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Customer Profile
          </h3>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-lg leading-none mb-1">
                  {order.customerName}
                </h4>
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold uppercase">
                    {order.customerTier} Tier
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {order.customerName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
            </div>

            <div className="space-y-2.5 mt-5">
              <div className="flex items-center space-x-3 text-sm text-slate-600 font-medium">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600 font-medium">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{order.customerEmail}</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-slate-600 font-medium pt-1">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="leading-snug">{order.deliveryAddress}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
            <Package className="w-3.5 h-3.5" /> <span>Order Summary</span>
          </h3>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="space-y-3 mb-4">
              {order.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-start text-sm"
                >
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold text-slate-400">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-indigo-600 text-lg">
                ${order.subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 flex flex-col space-y-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <button
          onClick={handleDispatch}
          disabled={order.status !== "pending"}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Truck className="w-4 h-4" />
          <span>
            {order.status === "pending" ? "Dispatch Order" : "Order Dispatched"}
          </span>
        </button>

        {order.status !== "pending" && order.status !== "delivered" && (
          <button
            onClick={handleReassign}
            className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all active:scale-[0.98]"
          >
            Re-assign Driver
          </button>
        )}
      </div>
    </div>
  );
}
