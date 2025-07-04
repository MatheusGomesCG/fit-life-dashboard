
import React from "react";
import AdminNavigation from "./AdminNavigation";
import AdminMobileNavigation from "./AdminMobileNavigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegação desktop */}
      <div className="hidden md:block">
        <AdminNavigation />
      </div>
      
      {/* Navegação mobile */}
      <AdminMobileNavigation />
      
      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
