"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { toggleMapMode } from "@/store/dashboardSlice";
import {
  Search,
  Map as MapIcon,
  List,
  Bell,
  Settings,
  LayoutGrid,
  Clock,
} from "lucide-react";

export default function TopNav() {
  // REDUX REFACTOR
  const dispatch = useAppDispatch();
  const isMapMode = useAppSelector((state) => state.dashboard.isMapMode);

  const [time, setTime] = useState<string>("");

  // Real-time dispatch clock
  useEffect(() => {
    const updateTime = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 z-20 relative shadow-sm">
      <div className="flex items-center justify-between">
        {/* Brand & Search */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 w-10 h-10 rounded-xl flex items-center justify-center shadow-md border border-indigo-500/30">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                Hayes Mercer
              </h1>
              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
                CoreSynix OS
              </p>
            </div>
          </div>

          <div className="relative w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Driver..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center space-x-6">
          {/* Live Dispatch Clock */}
          <div className="hidden lg:flex items-center space-x-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold tracking-wide">{time}</span>
          </div>

          {/* View Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200/60 shadow-inner">
            <button
              onClick={() => isMapMode && dispatch(toggleMapMode())} // REDUX DISPATCH
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                !isMapMode
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => !isMapMode && dispatch(toggleMapMode())} // REDUX DISPATCH
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                isMapMode
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Map</span>
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-2">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-3 pl-6 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 leading-none">
                Ishaan S.
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Administrator
              </p>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-slate-100">
              IS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
