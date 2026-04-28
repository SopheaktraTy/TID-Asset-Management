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

  useEffect(() => {
    const handler = (e: CustomEvent<{ collapsed: boolean }>) => {
      setCollapsed(e.detail.collapsed);
    };
    window.addEventListener("sidebar-toggle" as any, handler);
    return () => window.removeEventListener("sidebar-toggle" as any, handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar />
      {/* Main content shifts right by sidebar width */}
      <div
        className="flex-1 min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? "80px" : "260px" }}
      >
        <Header />
        <main className="transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
