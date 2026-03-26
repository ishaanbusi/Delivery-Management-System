"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { selectOrder } from "@/store/dashboardSlice";
import L from "leaflet";
import { useMemo } from "react";

const createCustomIcon = (color: string, isDriver: boolean = false) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: ${isDriver ? "18px" : "14px"}; height: ${isDriver ? "18px" : "14px"}; border-radius: ${isDriver ? "4px" : "50%"}; border: 2px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">${isDriver ? '<div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>' : ""}</div>`,
    iconSize: isDriver ? [18, 18] : [14, 14],
    iconAnchor: isDriver ? [9, 9] : [7, 7],
  });
};

export default function LiveMap() {
  // REDUX REFACTOR
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.dashboard.orders);
  const drivers = useAppSelector((state) => state.dashboard.drivers);
  const selectedOrderId = useAppSelector(
    (state) => state.dashboard.selectedOrderId,
  );

  const defaultCenter: [number, number] = [41.8781, -87.6298];

  const getStableCoords = useMemo(
    () =>
      (id: string, spread: number): [number, number] => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
          hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const latOffset = Math.sin(hash) * spread;
        const lngOffset = Math.cos(hash) * spread;
        return [defaultCenter[0] + latOffset, defaultCenter[1] + lngOffset];
      },
    [],
  );

  const activeOrders = orders.filter((o) => o.status !== "delivered");

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner relative z-0 border border-slate-200 bg-slate-100">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap"
        />

        {activeOrders.map((order) => {
          if (!order.driverId) return null;
          const driver = drivers.find((d) => d.id === order.driverId);
          if (!driver) return null;

          const orderCoords = getStableCoords(order.id, 0.08);
          const driverCoords = getStableCoords(driver.id, 0.05);
          const isSelected = selectedOrderId === order.id;

          return (
            <Polyline
              key={`route-${order.id}`}
              positions={[driverCoords, orderCoords]}
              color={isSelected ? "#4f46e5" : "#94a3b8"}
              weight={isSelected ? 4 : 2}
              dashArray={isSelected ? undefined : "5, 8"}
              opacity={isSelected ? 0.9 : 0.6}
              className={isSelected ? "animate-pulse" : ""}
            />
          );
        })}

        {activeOrders.map((order) => {
          let pinColor = "#f59e0b";
          if (order.status === "dispatched") pinColor = "#3b82f6";
          if (order.status === "in_transit") pinColor = "#4f46e5";
          if (order.status === "delayed") pinColor = "#ef4444";

          const coords = getStableCoords(order.id, 0.08);
          const isSelected = selectedOrderId === order.id;

          return (
            <Marker
              key={`order-${order.id}`}
              position={coords}
              icon={createCustomIcon(pinColor)}
              eventHandlers={{ click: () => dispatch(selectOrder(order.id)) }}
              zIndexOffset={isSelected ? 1000 : 0}
            >
              <Popup className="rounded-xl shadow-lg">
                <div className="p-1 min-w-[120px]">
                  <p className="font-bold text-slate-900 leading-none mb-1">
                    {order.id}
                  </p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">
                    {order.status.replace("_", " ")}
                  </p>
                  <button
                    onClick={() => dispatch(selectOrder(order.id))}
                    className="w-full text-[10px] bg-indigo-50 text-indigo-600 font-bold py-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {drivers.map((driver) => {
          const coords = getStableCoords(driver.id, 0.05);
          const isAvailable = driver.status === "available";
          return (
            <Marker
              key={`driver-${driver.id}`}
              position={coords}
              icon={createCustomIcon(isAvailable ? "#10b981" : "#1e293b", true)}
              zIndexOffset={500}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-slate-900 leading-none mb-1">
                    {driver.name}
                  </p>
                  <p
                    className={`text-[11px] font-bold uppercase ${isAvailable ? "text-emerald-600" : "text-slate-500"}`}
                  >
                    {driver.status.replace("_", " ")}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
