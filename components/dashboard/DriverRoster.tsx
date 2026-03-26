import { Driver, DriverStatus } from '@/types/dashboard';
import { Star, Package, Phone, MapPin, Truck } from 'lucide-react';

interface DriverRosterProps {
  drivers: Driver[];
}

const statusConfig: Record<
  DriverStatus,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  available: {
    label: 'Available',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    dotColor: 'bg-emerald-500',
  },
  on_delivery: {
    label: 'On Delivery',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    dotColor: 'bg-indigo-500',
  },
  offline: {
    label: 'Offline',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    dotColor: 'bg-slate-400',
  },
};

export default function DriverRoster({ drivers }: DriverRosterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {drivers.map((driver) => {
        const status = statusConfig[driver.status];
        return (
          <div
            key={driver.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  {driver.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {driver.name}
                  </h3>
                  <p className="text-sm text-slate-500">{driver.id}</p>
                </div>
              </div>

              <div
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg ${status.bgColor}`}
              >
                <div className={`w-2 h-2 rounded-full ${status.dotColor}`}></div>
                <span className={`text-xs font-semibold ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-1">Current Orders</p>
                <p className="text-2xl font-bold text-slate-900">
                  {driver.currentOrders}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Completed Today</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {driver.completedToday}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Rating</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <p className="text-2xl font-bold text-slate-900">
                    {driver.rating}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{driver.vehicle}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{driver.phone}</span>
              </div>
              {driver.location && (
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{driver.location}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
