import { Order } from '@/types/dashboard';
import { TriangleAlert as AlertTriangle, Clock, MapPin, User } from 'lucide-react';

interface ExceptionsViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export default function ExceptionsView({
  orders,
  onSelectOrder,
}: ExceptionsViewProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No Exceptions or Delays
        </h3>
        <p className="text-sm text-slate-500">
          All deliveries are running smoothly!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelectOrder(order)}
          className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {order.id}
                  </h3>
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-lg">
                    DELAYED
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Order has been delayed beyond expected delivery time
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-red-600">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">{order.timeElapsed}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-500">Customer</p>
              </div>
              <p className="font-medium text-slate-900">{order.customerName}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-500">Location</p>
              </div>
              <p className="font-medium text-slate-900 truncate">
                {order.deliveryAddress.split(',')[0]}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Driver</p>
              <p className="font-medium text-slate-900">
                {order.assignedDriver || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
