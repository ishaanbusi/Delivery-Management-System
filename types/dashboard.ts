export type OrderStatus = 'pending' | 'dispatched' | 'in_transit' | 'delivered' | 'delayed';
export type CustomerTier = 'gold' | 'silver' | 'bronze' | 'standard';
export type DriverStatus = 'available' | 'on_delivery' | 'offline';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  timeElapsed: string;
  customerName: string;
  customerTier: CustomerTier;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  assignedDriver: string | null;
  driverId: string | null;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryNotes?: string;
  gateCode?: string;
  timeline: {
    orderPlaced: Date;
    prep?: Date;
    driverAssigned?: Date;
    outForDelivery?: Date;
    delivered?: Date;
  };
}

export interface Driver {
  id: string;
  name: string;
  status: DriverStatus;
  currentOrders: number;
  completedToday: number;
  rating: number;
  vehicle: string;
  phone: string;
  location?: string;
}
