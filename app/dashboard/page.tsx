import StoreHydrator from "@/components/dashboard/StoreHydrator";
import DashboardClient from "@/components/dashboard/DashboardClient";
import StoreProvider from "@/components/dashboard/StoreProvider";
import { mockOrders, mockDrivers } from "@/data/mockData";

// Simulate a backend database fetch (The SSR Flex)
async function getDashboardData() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    orders: mockOrders,
    drivers: mockDrivers,
  };
}

export default async function DashboardPage() {
  const { orders, drivers } = await getDashboardData();

  return (
    // THE FIX: Wrap BOTH the Hydrator and the Client App in the Redux Provider!
    <StoreProvider>
      <StoreHydrator orders={orders} drivers={drivers} />
      <DashboardClient />
    </StoreProvider>
  );
}
