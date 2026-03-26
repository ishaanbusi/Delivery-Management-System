import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, Driver, OrderStatus } from '@/types/dashboard';

interface DashboardState {
  orders: Order[];
  drivers: Driver[];
  selectedOrderId: string | null;
  isMapMode: boolean;
}

const initialState: DashboardState = {
  orders: [],
  drivers: [],
  selectedOrderId: null,
  isMapMode: false,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // 1. SSR Hydration
    initializeStore: (state, action: PayloadAction<{ orders: Order[]; drivers: Driver[] }>) => {
      state.orders = action.payload.orders;
      state.drivers = action.payload.drivers;
    },
    
    // 2. UI Toggles
    selectOrder: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderId = action.payload;
    },
    toggleMapMode: (state) => {
      state.isMapMode = !state.isMapMode;
    },

    // 3. Complex Business Logic (Look how clean this is with RTK!)
    dispatchOrder: (state, action: PayloadAction<{ orderId: string; driverId: string }>) => {
      const { orderId, driverId } = action.payload;
      const driver = state.drivers.find(d => d.id === driverId);
      const order = state.orders.find(o => o.id === orderId);

      if (driver && order) {
        order.status = 'dispatched';
        order.assignedDriver = driver.name;
        order.driverId = driver.id;
        order.timeline.driverAssigned = new Date();
        
        driver.status = 'on_delivery';
        driver.currentOrders += 1;
      }
    },

    // 4. The Simulation Tick
    tickSimulation: (state) => {
      state.orders.forEach(order => {
        const randomChance = Math.random();
        if (order.status === 'in_transit' && randomChance > 0.95) {
          order.status = 'delivered';
          order.timeline.delivered = new Date();
        } else if (order.status === 'dispatched' && randomChance > 0.98) {
          order.status = 'delayed';
        }
      });
    }
  }
});

export const { initializeStore, selectOrder, toggleMapMode, dispatchOrder, tickSimulation } = dashboardSlice.actions;
export default dashboardSlice.reducer;