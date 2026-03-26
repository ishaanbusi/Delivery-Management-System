import { create } from 'zustand';
import { Order, Driver, OrderStatus } from '@/types/dashboard';

interface DashboardState {
  // Data
  orders: Order[];
  drivers: Driver[];
  
  // UI State
  selectedOrderId: string | null;
  isMapMode: boolean;
  
  // Computed (Derived) State
  getSelectedOrder: () => Order | undefined;
  
  // Actions
  selectOrder: (id: string | null) => void;
  toggleMapMode: () => void;
  dispatchOrder: (orderId: string, driverId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Simulation Action (The "Fake Backend")
  tickSimulation: () => void;

  // NEW: Hydration Action (For Next.js SSR)
  initializeStore: (orders: Order[], drivers: Driver[]) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Start empty! The Next.js server will fetch the data and inject it here via the Hydrator.
  orders: [],
  drivers: [],
  selectedOrderId: null,
  isMapMode: false,

  getSelectedOrder: () => {
    return get().orders.find((o) => o.id === get().selectedOrderId);
  },

  selectOrder: (id) => set({ selectedOrderId: id }),
  
  toggleMapMode: () => set((state) => ({ isMapMode: !state.isMapMode })),

  dispatchOrder: (orderId, driverId) => set((state) => {
    const driver = state.drivers.find(d => d.id === driverId);
    if (!driver) return state;

    return {
      orders: state.orders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: 'dispatched', 
              assignedDriver: driver.name, 
              driverId: driver.id,
              timeline: { ...order.timeline, driverAssigned: new Date() }
            } 
          : order
      ),
      drivers: state.drivers.map(d =>
        d.id === driverId ? { ...d, status: 'on_delivery', currentOrders: d.currentOrders + 1 } : d
      )
    };
  }),

  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    )
  })),

  tickSimulation: () => set((state) => {
    // This is our fake backend. It randomly updates order statuses.
    const newOrders = state.orders.map(order => {
      const randomChance = Math.random();
      
      // 5% chance an in_transit order gets delivered
      if (order.status === 'in_transit' && randomChance > 0.95) {
        return { ...order, status: 'delivered' as OrderStatus, timeline: { ...order.timeline, delivered: new Date() } };
      }
      // 2% chance a dispatched order gets delayed
      if (order.status === 'dispatched' && randomChance > 0.98) {
        return { ...order, status: 'delayed' as OrderStatus };
      }
      
      return order;
    });

    return { orders: newOrders };
  }),

  // NEW: Injection method for SSR Hydration
  initializeStore: (orders, drivers) => set({ orders, drivers }),
}));