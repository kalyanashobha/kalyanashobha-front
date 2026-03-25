import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom"; 
import { Menu } from "lucide-react"; 
import "./AdminLayout.css"; 

export default function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    // Fixed: Matches .admin-root-layout in CSS
    <div className="admin-root-layout"> 
      
      {/* Fixed: Matches .admin-mobile-header in CSS */}
      <div className="admin-mobile-header">
        <h3 style={{ margin: 0 }}>KalyanaShobha</h3>
        <button 
           className="mobile-menu-btn" 
           onClick={() => setIsMobileSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Fixed: Toggles "mobile-open" to match your CSS */}
      <div className={`sidebar-wrapper ${isMobileSidebarOpen ? "mobile-open" : ""}`}>
        
        <AdminSidebar closeSidebar={handleCloseSidebar} />
        
        {/* Fixed: Moved overlay inside sidebar-wrapper so your CSS selector (.sidebar-wrapper.mobile-open .sidebar-overlay) works! */}
        <div className="sidebar-overlay" onClick={handleCloseSidebar}></div>
      </div>

      {/* Fixed: Matches .admin-main-content in CSS */}
      <main className="admin-main-content">
        <Outlet /> 
      </main>
      
    </div>
  );
}
