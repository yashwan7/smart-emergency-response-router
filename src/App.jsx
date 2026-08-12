import React from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <SimulationProvider>
      <AppShell />
    </SimulationProvider>
  );
}
