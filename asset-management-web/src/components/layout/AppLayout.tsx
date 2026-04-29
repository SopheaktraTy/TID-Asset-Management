import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

/**
 * AppLayout — shared shell for all protected pages.
 * Renders the collapsible Sidebar on the left and the page content on the right.
 * The main area's left padding tracks the sidebar width automatically via a 
 * custom event from the Sidebar.
 */
export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    
    const sidebarHandler = (e: CustomEvent<{ collapsed: boolean }>) => {
      setCollapsed(e.detail.collapsed);
    };

    window.addEventListener("sidebar-toggle" as any, sidebarHandler);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("sidebar-toggle" as any, sidebarHandler);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--bg)] w-full">
      <Sidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />

      {/* Main content padding tracks sidebar width */}
      <div
        className="flex-1 min-h-screen transition-all duration-300 ease-in-out flex flex-col min-w-0"
        style={{ paddingLeft: isMobile ? "0" : (collapsed ? "80px" : "260px") }}
      >
        <Header 
          collapsed={collapsed} 
          isMobile={isMobile} 
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />
        <main className="flex-1 transition-all duration-300 pt-20 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-transparent z-[45] transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
