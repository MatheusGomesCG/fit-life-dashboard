
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ThemeToggle from '@/components/ThemeToggle';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">FitnessPro</h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <Toaster />
    </div>
  );
};

export default Layout;
