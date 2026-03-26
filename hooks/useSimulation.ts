'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/store';
import { tickSimulation } from '@/store/dashboardSlice';

export function useSimulation() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Run the fake backend every 5 seconds
    const interval = setInterval(() => {
      dispatch(tickSimulation());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);
}