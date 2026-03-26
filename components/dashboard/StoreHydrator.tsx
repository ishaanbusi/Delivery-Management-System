"use client";

import { useRef } from "react";
import { useAppDispatch } from "@/store/store";
import { initializeStore } from "@/store/dashboardSlice";
import { Order, Driver } from "@/types/dashboard";

export default function StoreHydrator({
  orders,
  drivers,
}: {
  orders: Order[];
  drivers: Driver[];
}) {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  if (!initialized.current) {
    dispatch(initializeStore({ orders, drivers }));
    initialized.current = true;
  }

  return null;
}
